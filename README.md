# gatsby-source-twitter

![Check code](https://github.com/G100g/gatsby-source-twitter/workflows/Check%20code/badge.svg)

Source plugin for pulling data into Gatsby from Twitter Search API.

## Supported API

Actually the plugin support a bunch of API endopoints

- [search/tweets](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets) - Search for tweets
- [statuses/show](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-show-id) - Get specific tweet
- [statuses/lookup](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-lookup) - Get specific multiple tweets
- [statuses/user_timeline](https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline) - Get user timeline tweets
- [favorites/list](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-favorites-list) - Get liked tweets from specific user
- [statuses/oembed](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-oembed) - Get oembed code from tweet url
- [lists/members](https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/get-lists-members) - Returns the members of the specified list
- [lists/statuses](https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/get-lists-statuses) - Returns a timeline of tweets authored by members of the specified list

Check [Twitter documentation](https://developer.twitter.com/en/docs) for more details

## How to use

To start using this plugin you have to create an [App on developer](https://developer.twitter.com/en/apps) and then create a [bearer token](https://developer.twitter.com/en/docs/basics/authentication/guides/bearer-tokens.html) to use application authentication

> Note: Only api that use application authentication will works. User authentication api are not supported

Here an example of the configuration

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-twitter`,
      options: {
        credentials: {
          consumer_key: "INSERT_HERE_YOUR_CONSUMER_KEY",
          consumer_secret: "INSERT_HERE_YOUR_CONSUMER_SECRET",
          bearer_token: "INSERT_HERE_YOUR_BEARER_TOKEN",
        },
        queries: {
          nameofthequery: {
            endpoint: "statuses/user_timeline",
            params: {
              screen_name: "gatsbyjs",
              include_rts: false,
              exclude_replies: true,
              tweet_mode: "extended",
            },
          },
          nameofanotherthequery: {
            endpoint: "search/tweets",
            params: {
              q: "#gatsbyjs",
              tweet_mode: "extended",
            },
          },
        },
      },
    },
  ],
}
```

> Check [this repository](https://github.com/G100g/gatsby-source-twitter-example) for more example.

## Plugin options

### credentials

You have to create an [App on Twitter](https://apps.twitter.com/) and creating a bearer token following this [instructions](https://developer.twitter.com/en/docs/basics/authentication/guides/bearer-tokens.html) using your consumer key and consumer secret

### queries

You have to specify a object where each key is a query to Twitter API.

Choose a name for the query (you will use later to retrieve data), for example `gatsbyHashtag`, but you can use whatever you want.

```js
queries: {
  gatsbyHashtag: {
    endpoint: "search/tweets",
    params: {
      q: "#gatsbyjs",
      tweet_mode: "extended",
    },
  },
},
```

- **endpoint**: The endpoint of one of the supported API.
- **params**: The allowed params of the API specified with `endpoint` option.
- **fetchAllResults**: Fetch all result cycling through pages. (Only for `search/tweets`)

## How to query your Tweets data using GraphQL

Now that you fetch some data from Twitter, you can access it with a GraphQL query.

The below `gatsbyHashtag` query will became `allTwitterGatsbyHashtag`

Below is a sample query for fetching all Tweets nodes.

```graphql
query {
  allTwitterGatsbyHashtag {
    edges {
      node {
        full_text # or text depending by endpoint params
        user {
          name
        }
      }
    }
  }
}
```

> **Warning**: `id` field is not the tweet id, but Gatbsy internal node id. Use `id_str` if you need to use the tweet id

## Breaking changes

3.x.x version contains some breaking changes. Here an example of how to migrate from 2.x version

## Old options

```js
options: {
  q: `@wesbos`,
  credentials: {
      consumer_key: "INSERT_HERE_YOUR_CONSUMER_KEY",
      consumer_secret: "INSERT_HERE_YOUR_CONSUMER_SECRET",
      bearer_token: "INSERT_HERE_YOUR_BEARER_TOKEN"
  },
  tweet_mode: 'extended'
}
```

## New options

```js
options: {
  credentials: {
    consumer_key: "INSERT_HERE_YOUR_CONSUMER_KEY",
    consumer_secret: "INSERT_HERE_YOUR_CONSUMER_SECRET",
    bearer_token: "INSERT_HERE_YOUR_BEARER_TOKEN",
  },
  queries: {
    wesbos: {
      endpoint: "search/tweets",
      params: {
        q: "@wesbos",
        tweet_mode: "extended",
      },
    },
  },
},
```

## Updated GraphQL query

```
query {
    allTwitterWesbos {
        edges {
            node {
                created_at
                full_text
                user {
                    name
                }
            }
        }
    }
}
```
