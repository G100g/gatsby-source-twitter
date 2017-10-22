const crypto = require("crypto");
const Twitter = require("twitter");

function sanitizeObject(obj) {
  if (!obj) return obj;
  Object.keys(obj).forEach(key => {
    if (key === "id") {
      obj[key] = `${obj[key]}`;
    } else if (typeof obj[key] === "object") {
      obj[key] = sanitizeObject(obj[key]);
    }
  });

  return obj;
}

function generateNode(tweet) {
  const contentDigest = crypto.createHash(`md5`).update(JSON.stringify(tweet)).digest(`hex`);

  // GraphQL doesn't love twitter ids
  tweet = sanitizeObject(tweet);

  const nodeData = Object.assign({}, tweet, {
    id: `${tweet.id_str}`,
    children: [],
    parent: null,
    internal: {
      type: `tweet`,
      contentDigest
    }
  });

  return nodeData;
}

exports.sourceNodes = ({ boundActionCreators }, { q, credentials, count = 100 }) => {
  const { createNode } = boundActionCreators;

  var client = new Twitter(credentials);

  return client.get("search/tweets", {
    q,
    count
  }).then(results => {
    results.statuses.forEach(tweet => {
      createNode(generateNode(tweet));
    });
  });
};