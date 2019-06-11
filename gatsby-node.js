"use strict";

const Twitter = require(`twitter`);

const fs = require(`fs`);

const getTweet = require(`./twitter`);

const {
  md5,
  log,
  camelCase
} = require(`./utils`);

const DEBUG = process.env.DEBUG === `true`;

function generateNode(tweet, contentDigest, type) {
  const id = md5(tweet.id_str || tweet.toString());
  const nodeData = {
    id: id,
    children: [],
    parent: `__SOURCE__`,
    internal: {
      type,
      contentDigest
    } // Removing place.bounding_box duo coordinates GraphQL issue
    // Help wantend!

  };

  if (tweet && tweet.place && tweet.place.bounding_box) {
    delete tweet.place.bounding_box;
    tweet.place.bounding_box = null;
  }

  const node = Object.assign({}, tweet, nodeData);
  return node;
}

exports.sourceNodes = async ({
  boundActionCreators,
  createContentDigest
}, {
  queries,
  credentials
}) => {
  const {
    createNode
  } = boundActionCreators;

  function createNodes(tweets, nodeType) {
    tweets.forEach(tweet => {
      createNode(generateNode(tweet, createContentDigest(tweet), nodeType));
    });
  } // Fetch data for current API call


  if (queries) {
    var client = new Twitter(credentials);
    return Promise.all(Object.keys(queries).map(async queryName => {
      const results = await getTweet(client, queries[queryName]);
      return {
        queryName,
        results
      };
    }).map(async queryResults => {
      const {
        queryName,
        results
      } = await queryResults;
      const nodeType = camelCase(`twitter ${queryName}`);

      if (DEBUG === true) {
        saveResult(queryName, results);
      }

      if (results.length) {
        log(`Creating Twitter nodes ${nodeType} ...`);
        createNodes(results, nodeType);
      } else {
        log(`No twitter results`);
      }
    }));
  } else {
    log(`No Twitter query found. Please check your configuration`);
  }

  return Promise.resolve();
};

function saveResult(queryName, results) {
  fs.writeFileSync(`./tweets-${queryName}.json`, JSON.stringify(results, null, 4), {
    encoding: `utf8`
  });
} // const isTweetType = /^twitter/
// exports.setFieldsOnGraphQLNodeType = ({ type }) => {
//   if (!isTweetType.test(type.name)) {
//     return {}
//   }
//   return twitterType
// }