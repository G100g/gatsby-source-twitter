const Twitter = require("twitter");
const co = require("co");
const fs = require("fs");
const querystring = require("querystring");

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

  // Removing place.bounding_box duo coordinates GraphQL issue
  // Help wantend!
  if (tweet && tweet.place && tweet.place.bounding_box) {
    delete tweet.place.bounding_box;
    tweet.place.bounding_box = null;
  }

  const node = Object.assign({}, tweet, nodeData);

  return node;
}

exports.sourceNodes = (
  { boundActionCreators },
  {
    q,
    credentials,
    count = 100,
    tweet_mode = "compat",
    result_type = "mixed",
    fetchAllResults = false
  }
) => {
  const { createNode } = boundActionCreators;

  function createNodes(tweets) {
    tweets.forEach(tweet => {
      createNode(generateNode(tweet));
    });
  }

  var client = new Twitter(credentials);

  return co(function*() {
    // Get Twitter
    let results = yield client.get("search/tweets", {
      q,
      count,
      include_entities: true,
      tweet_mode,
      result_type
    });

    createNodes(results.statuses);

    if (fetchAllResults === true) {
      while (results.search_metadata.next_results) {
        let params = querystring.parse(
          results.search_metadata.next_results.substr(1)
        );

        results = yield client.get("search/tweets", params);

        createNodes(results.statuses);
      }
    }
  });
};

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name !== `Tweet`) {
    return {};
  }
  return twitterType;
};
