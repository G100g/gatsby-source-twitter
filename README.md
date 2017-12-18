# gatsby-source-twitter

Source plugin for pulling data into Gatsby from Twitter Search API.

## How to use
```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
        resolve: `gatsby-source-twitter`,
        options: {           
            q: `@wesbos`,    
            credentials: {
                consumer_key: "INSERT_HERE_YOUR_CONSUMER_KEY",
                consumer_secret: "INSERT_HERE_YOUR_CONSUMER_SECRETE",
                bearer_token: "INSERT_HERE_YOUR_BEARER_TOKEN"
            },
            tweet_mode: 'extended'
        }
    }
  ],
}
```

## Plugin options

* **q**: A search query. Reference to [Twitter Search Tweets API](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets)
* **count**: Number of tweet *(default 100)*
* **credential**: You have to create an [App on Twitter](https://apps.twitter.com/) and creating a bearer token following this [instructions](https://developer.twitter.com/en/docs/basics/authentication/api-reference/token) using your consumer key and consumer secret
* **tweet_mode**: Define how tweets are rendered. Possible values ```compat``` or ```extended``` (default: ```compat```) [More Details]
(https://developer.twitter.com/en/docs/tweets/tweet-updates#consumption)
* **result_type**: Default ```mixed```, could be ```mixed```, ```recent``` or ```popular```
ca903f5a5eeff3c947f8bcb93376dab433b7a7aff5fc96dc79372e70a5e1dc3b24cdc084f0fc69cdcf379591256941bbafe24cb6db0c463c613230a91e6fc72739c7a51cd4cb030590f0b4f4679cbd96c42550e50641fecae2d8708e21fefcb0a3db0c1642ffe5b70e14fca9d40c90a110c67844d80d3300d9950f3a72e591d91dd23f02c8a7f3e5579c464ef85006de9cd2bbdb3ac60782ca5fac233dd41df3
* **fetchAllResults**: Fetch all pages result

## How to query your Tweets data using GraphQL

Below is a sample query for fetching all Tweets nodes. 

```graphql
query PageQuery {
    allTweet {
        edges {
            node {
                created_at
                text
                user {
                    name
                }
            }
        }
    }
}
```

> **Warning**: ```id``` field is not the tweet id, but Gatbsy internal node id. Use ```id_str``` if you need to use the tweet id