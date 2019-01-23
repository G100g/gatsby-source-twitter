const Twitter = require("twitter");
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

exports.sourceNodes = async (
    { boundActionCreators },
    {
        q,
        credentials,
        count = 100,
        tweet_mode = "compat",
        result_type = "mixed",
        fetchAllResults = false,
        debug = false
    }
) => {
    const { createNode } = boundActionCreators;

    function createNodes(tweets) {
        tweets.forEach(tweet => {
            createNode(generateNode(tweet));
        });
    }

    var client = new Twitter(credentials);

    let results = await client.get("search/tweets", {
        q,
        count,
        include_entities: true,
        tweet_mode,
        result_type
    });
    // saveResult(results);
    createNodes(results.statuses);

    if (fetchAllResults === true) {
        while (results.search_metadata.next_results) {
            let params = querystring.parse(
                results.search_metadata.next_results.substr(1)
            );

            params.tweet_mode = tweet_mode;
            params.result_type = result_type;

            results = await client.get("search/tweets", params);

            createNodes(results.statuses);
        }
    }
};

function saveResult(results, index = 0) {
    // TODO: ADD DEBUG MODE
    fs.writeFileSync(
        `./tweets-${index}.json`,
        JSON.stringify(results, null, 4),
        {
            encoding: "utf8"
        }
    );
}

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
    if (type.name !== `Tweet`) {
        return {};
    }
    return twitterType;
};
