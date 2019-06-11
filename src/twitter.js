const { log, logDebug, logError } = require(`./utils`)
const querystring = require(`querystring`)

const defaultHandle = async function(client, endpoint, { params }) {
  try {
    const results = await client.get(endpoint, params)
    // console.log(endpoint, results)
    return results.length ? results : [results]
  } catch (e) {
    logError(`Error from "${endpoint}" - ${e.message}`)
    console.error(e)
  }
  return []
  // return false
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
    logDebug(JSON.stringify({ endpoint, ...queryParams }, null, 2))

    let lastResults
    try {
      lastResults = await client.get(endpoint, queryParams)
    } catch (e) {
      logError(`Fetch error ${endpoint}: ${e.message}`)
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
  "statuses/user_timeline": defaultHandle,
  "search/tweets": searchHandle,
  default: (client, endpoint) => {
    log(`${endpoint} endpoint is not supported`)
    return []
  },
}

const getHandle = endpoint => handles[endpoint] || handles.default

module.exports = async (client, { endpoint, ...options }) => {
  log(`Fetching Twitter ${endpoint} content...`)

  const handle = getHandle(endpoint)

  const results = await handle(client, endpoint, options)

  return results
}
