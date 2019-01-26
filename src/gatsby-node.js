const Twitter = require("twitter");
const fs = require("fs");
const querystring = require("querystring");

const { md5 } = require("./utils");

const { twitterType } = require("./schema");

const logNamespace = `\x1b[36mtwitter\x1b[0m`;
const debugNamespace = `\x1b[33mtwitter\x1b[0m`;

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

    function log(msg, namespace = logNamespace) {
        console.log(`\n${namespace} ${msg}`);
    }

    function logDebug(msg) {
        if (debug === true) {
            log(msg, debugNamespace);
        }
    }

    var client = new Twitter(credentials);

    const results = [];

    log("Fetching Twitter content...");
    results.push(
        await client.get("search/tweets", {
            q,
            count,
            include_entities: true,
            tweet_mode,
            result_type
        })
    );

    if (fetchAllResults === true) {
        let [lastResult] = results;
        if (
            lastResult &&
            lastResult.search_metadata &&
            lastResult.search_metadata.next_results
        ) {
            log("Fetching all Twitter results...");
            while (lastResult.search_metadata.next_results) {
                let params = querystring.parse(
                    lastResult.search_metadata.next_results.substr(1)
                );
                params.tweet_mode = tweet_mode;
                params.result_type = result_type;

                logDebug(JSON.stringify(params, null, 2));

                lastResult = await client.get("search/tweets", params);

                results.push(lastResult);
            }
        }
    }

    log("Creating Twitter nodes...");
    results.forEach((result, index) => {
        createNodes(result.statuses);
        if (debug === true) {
            saveResult(results, index);
        }
    });
};

function saveResult(results, index = 0) {
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
