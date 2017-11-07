const Twitter = require("twitter");

const fs = require("fs");

const { md5 } = require("./utils");

const { twitterType } = require("./schema");

function generateNode(tweet) {
  const contentDigest = md5(JSON.stringify(tweet));
  const id = md5(tweet.id_str);

  const nodeData = {
    id: id,
    children: [],
    parent: `__SOURCE__`,
    internal: {
      type: `Tweet`,
      contentDigest
    }
  };

  const node = Object.assign({}, tweet, nodeData);

  return node;
}

exports.sourceNodes = ({ boundActionCreators }, { q, credentials, count = 100, tweet_mode = "compat" }) => {
  const { createNode } = boundActionCreators;

  var client = new Twitter(credentials);

  return client.get("search/tweets", {
    q,
    count,
    include_entities: true,
    tweet_mode
  }).then(results => {
    results.statuses.forEach(tweet => {
      createNode(generateNode(tweet));
    });
  });
};

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name !== `Tweet`) {
    return {};
  }
  return twitterType;
};