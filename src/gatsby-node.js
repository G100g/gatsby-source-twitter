const Twitter = require(`twitter`)
const fs = require(`fs`)

const getTweet = require(`./twitter`)
const { md5, log, camelCase } = require(`./utils`)

const { twitterType } = require(`./schema`)

const DEBUG = !!process.env.DEBUG

function generateNode(tweet, contentDigest, type) {
  const id = md5(tweet.id_str)

  const nodeData = {
    id: id,
    children: [],
    parent: `__SOURCE__`,
    internal: {
      type,
      contentDigest,
    },
  }

  // Removing place.bounding_box duo coordinates GraphQL issue
  // Help wantend!
  if (tweet && tweet.place && tweet.place.bounding_box) {
    delete tweet.place.bounding_box
    tweet.place.bounding_box = null
  }

  const node = Object.assign({}, tweet, nodeData)

  return node
}

exports.sourceNodes = async (
  { boundActionCreators, createContentDigest },
  {
    queries,
    credentials,
    // count = 100,
    // tweet_mode = "compat",
    // result_type = "mixed",
    fetchAllResults = false,
    debug = false,
  }
) => {
  const { createNode } = boundActionCreators

  function createNodes(tweets, nodeType) {
    tweets.forEach(tweet => {
      createNode(generateNode(tweet, createContentDigest(tweet), nodeType))
    })
  }

  // Fetch data for current API call
  if (queries) {
    var client = new Twitter(credentials)

    return Promise.all(
      Object.keys(queries)
        .map(async queryName => {
          const results = await getTweet(client, queries[queryName])
          return {
            queryName,
            results,
          }
        })
        .map(async queryResults => {
          const { queryName, results } = await queryResults
          const nodeType = camelCase(`twitter ${queryName}`)

          log(`Creating Twitter nodes ${nodeType} ...`)
          // results.forEach((result, index) => {
          createNodes(results, nodeType)
          if (DEBUG === true) {
            saveResult(results)
          }
        })
    )
  } else {
    log(`No Twitter query found. Please check your configuration`)
  }

  return Promise.resolve()
}

function saveResult(results, index = 0) {
  fs.writeFileSync(`./tweets-${index}.json`, JSON.stringify(results, null, 4), {
    encoding: `utf8`,
  })
}

const isTweetType = /^twitter/

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (!isTweetType.test(type.name)) {
    return {}
  }
  return twitterType
}
