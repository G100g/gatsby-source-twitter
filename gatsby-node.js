"use strict";

const Twitter = require(`twitter`);

const fs = require(`fs`);

const getTweet = require(`./twitter`);

const {
  md5,
  camelCase
} = require(`./utils`);

const {
  twitterType
} = require(`./schema`);

const nodeTypes = [];
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
  createContentDigest,
  actions,
  reporter
}, {
  queries,
  credentials
}) => {
  const {
    createNode
  } = boundActionCreators;
  const {
    createTypes
  } = actions;

  function createNodes(tweets, nodeType) {
    tweets.forEach(tweet => {
      createNode(generateNode(tweet, createContentDigest(tweet), nodeType));
    });
  }

  function createEmptyTypes(nodeType) {
    reporter.warn(`Create empty type ${nodeType}`);
    const typeDefs = `
              type ${nodeType} implements Node {
                id: String
              }

              type ${nodeType} implements Node {
                id: String
              }
            `;
    createTypes(typeDefs);
  } // Fetch data for current API call


  if (queries) {
    var client = new Twitter(credentials);
    return Promise.all(Object.keys(queries).map(async queryName => {
      const nodeType = camelCase(`twitter ${queries[queryName].endpoint} ${queryName}`);
      const results = await getTweet(client, queries[queryName], reporter);
      nodeTypes.push(nodeType);
      return {
        queryName,
        nodeType,
        results
      };
    }).map(async queryResults => {
      const {
        queryName,
        results,
        nodeType
      } = await queryResults;

      if (DEBUG === true) {
        saveResult(queryName, results);
      }

      if (results.length) {
        reporter.info(`Creating Twitter nodes ${nodeType} ...`);
        createNodes(results, nodeType);
      } else {
        reporter.warn(`No twitter results from ${queryName}`); // Create type for empty results
        // createEmptyTypes(nodeType)
      }
    }));
  } else {
    reporter.warn(`No Twitter query found. Please check your configuration`);
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