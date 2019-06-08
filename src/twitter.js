const { log, logDebug } = require(`./utils`)
const querystring = require(`querystring`)

module.exports = async (
  client,
  { endpoint, fetchAllResults = false, ...params }
) => {
  const results = []

  log(`Fetching Twitter content...`)

  let fetchNextResults = true

  let queryParams = params

  while (fetchNextResults) {
    logDebug(JSON.stringify(queryParams, null, 2))
    let lastResults = await client.get(endpoint, queryParams)
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
