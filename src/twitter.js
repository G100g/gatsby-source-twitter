const querystring = require(`querystring`)
const { decrementHugeNumberBy1 } = require(`./utils`)
module.exports = async (client, { endpoint, ...options }, reporter) => {
  const defaultHandle = async function(client, endpoint, { params }) {
    try {
      const results = await client.get(endpoint, params)
      return results.length ? results : [results]
    } catch (e) {
      reporter.error(`Error from "${endpoint}" - ${e.message}`)
      console.error(e)
    }
    return []
  }
  const userTimelineHandle = async function(
    client,
    endpoint,
    { maxCount = 200, params }
  ) {
    let results = []
    let queryParams = { count: 200, ...params }
    let fetchNextResults = true

    while (fetchNextResults) {
      // reporter.info(JSON.stringify({ endpoint, ...queryParams }, null, 2))

      let lastResults
      try {
        lastResults = await client.get(endpoint, queryParams)
      } catch (e) {
        reporter.error(`Fetch error ${endpoint}: ${e.message}`)
      }
      if (lastResults.length) {
        results = results.concat(lastResults)
      }

      if (
        lastResults.length &&
        lastResults.length >= queryParams.count &&
        maxCount > results.length
      ) {
        queryParams = {
          ...params,
          max_id: decrementHugeNumberBy1(
            lastResults[lastResults.length - 1].id_str
          ),
        }
      } else {
        fetchNextResults = false
      }
    }
    return results.slice(0, maxCount)
  }
  const usersHandle = async function(client, endpoint, { params }) {
    try {
      const results = await client.get(endpoint, params)
      return results && results.users && results.users.length
        ? results.users
        : []
    } catch (e) {
      reporter.error(`Error from "${endpoint}" - ${e.message}`)
      console.error(e)
    }
    return []
  }

  const searchHandle = async function(
    client,
    endpoint,
    { fetchAllResults = false, params }
  ) {
    const results = []
    let queryParams = { ...params }
    let fetchNextResults = true

    while (fetchNextResults) {
      // reporter.info(JSON.stringify({ endpoint, ...queryParams }, null, 2))

      let lastResults
      try {
        lastResults = await client.get(endpoint, queryParams)
      } catch (e) {
        reporter.error(`Fetch error ${endpoint}: ${e.message}`)
      }

      if (lastResults && lastResults.statuses) {
        results.push(...lastResults.statuses)
      }

      if (
        fetchAllResults === true &&
        lastResults &&
        lastResults.search_metadata &&
        lastResults.search_metadata.next_results
      ) {
        queryParams = {
          ...querystring.parse(
            lastResults.search_metadata.next_results.substr(1)
          ),
          ...params,
        }
      } else {
        fetchNextResults = false
      }
    }

    return results
  }

  const handles = {
    "favorites/list": defaultHandle,
    "statuses/show": defaultHandle,
    "statuses/lookup": defaultHandle,
    "statuses/oembed": defaultHandle,
    "statuses/user_timeline": userTimelineHandle,
    "lists/statuses": defaultHandle,
    "lists/members": usersHandle,
    "search/tweets": searchHandle,
    default: (client, endpoint) => {
      reporter.warn(`${endpoint} endpoint is not supported`)
      return []
    },
  }

  const getHandle = endpoint => handles[endpoint] || handles.default

  reporter.info(`Fetching Twitter ${endpoint} content...`)

  const handle = getHandle(endpoint)

  const results = await handle(client, endpoint, options)

  return results
}
