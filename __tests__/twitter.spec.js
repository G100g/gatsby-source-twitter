jest.mock(`twitter`)

const Twitter = require(`twitter`)
const getTweet = require(`../src/twitter`)

const { statuses: mockTweets } = require(`../__mocks__/search-result-mock`)
const timelineResultMock = require(`../__mocks__/timeline-result-mock`)
const lookupResultMock = require(`../__mocks__/lookup-result-mock`)
const favoriteResultMock = require(`../__mocks__/favorite-result-mock`)
const singleResultMock = require(`../__mocks__/single-result-mock`)
const oembedResultMock = require(`../__mocks__/oembed-result-mock`)

describe.only(`Twitter`, () => {
  test(`Should use params`, async () => {
    const options = {
      endpoint: `search/tweets`,
      params: {
        q: `#gatsbyjs`,
      },
      fetchAllResults: true,
    }
    var mockClient = new Twitter()

    await getTweet(mockClient, options)

    expect(mockClient.__params).toMatchObject(options.params)
  })

  test(`Should handle 'search/tweets' endpoint`, async () => {
    const options = {
      endpoint: `search/tweets`,
      params: {
        q: `#kitten`,
      },
    }
    var mockClient = new Twitter()

    const tweets = await getTweet(mockClient, options)

    expect(tweets).toHaveLength(4)

    expect(tweets[0]).toEqual(mockTweets[0])
    expect(tweets[1]).toEqual(mockTweets[1])
    expect(tweets[2]).toEqual(mockTweets[2])
    expect(tweets[3]).toEqual(mockTweets[3])
  })

  test(`Should handle 'search/tweets' endpoint - All results`, async () => {
    const options = {
      endpoint: `search/tweets`,
      params: {
        q: `#kitten`,
      },
      fetchAllResults: true,
    }
    var mockClient = new Twitter()

    mockClient.numberOfPageResult = 2

    const tweets = await getTweet(mockClient, options)

    expect(tweets).toHaveLength(8)

    expect(tweets[0]).toEqual(mockTweets[0])
    expect(tweets[1]).toEqual(mockTweets[1])
    expect(tweets[2]).toEqual(mockTweets[2])
    expect(tweets[3]).toEqual(mockTweets[3])
    expect(tweets[4]).toEqual(mockTweets[0])
    expect(tweets[5]).toEqual(mockTweets[1])
    expect(tweets[6]).toEqual(mockTweets[2])
    expect(tweets[7]).toEqual(mockTweets[3])
  })

  test(`Should handle 'statuses/user_timeline' endpoint`, async () => {
    const options = {
      endpoint: `statuses/user_timeline`,
      params: {
        id: `gatsbyjs`,
      },
      fetchAllResults: true,
    }
    var mockClient = new Twitter()

    const tweets = await getTweet(mockClient, options)

    expect(tweets).toHaveLength(1)

    expect(tweets[0]).toEqual(timelineResultMock[0])
  })

  test(`Should handle 'statuses/lookup' endpoint`, async () => {
    const options = {
      endpoint: `statuses/lookup`,
      params: {
        id: `1,2,3,4,5`,
      },
      fetchAllResults: true,
    }
    var mockClient = new Twitter()

    const tweets = await getTweet(mockClient, options)

    expect(tweets).toHaveLength(2)

    expect(tweets[0]).toEqual(lookupResultMock[0])
    expect(tweets[1]).toEqual(lookupResultMock[1])
  })

  test(`Should handle 'favorites/list' endpoint`, async () => {
    const options = {
      endpoint: `favorites/list`,
      params: {
        screen_name: `gatsbyjs`,
      },
      fetchAllResults: true,
    }
    var mockClient = new Twitter()

    const tweets = await getTweet(mockClient, options)

    expect(tweets).toHaveLength(2)

    expect(tweets[0]).toEqual(favoriteResultMock[0])
    expect(tweets[1]).toEqual(favoriteResultMock[1])
  })

  test(`Should handle 'statuses/show' endpoint`, async () => {
    const options = {
      endpoint: `statuses/show`,
      params: {
        id: `123`,
      },
      fetchAllResults: true,
    }
    var mockClient = new Twitter()

    const tweets = await getTweet(mockClient, options)

    expect(tweets).toHaveLength(1)

    expect(tweets[0]).toEqual(singleResultMock)
  })

  test(`Should handle 'statuses/oembed' endpoint`, async () => {
    const options = {
      endpoint: `statuses/oembed`,
      params: {
        url: `https://twitter.com/gatsbyjs/status/1041804966598299648`,
      },
      fetchAllResults: true,
    }
    var mockClient = new Twitter()

    const tweets = await getTweet(mockClient, options)

    expect(tweets).toHaveLength(1)

    expect(tweets[0]).toEqual(oembedResultMock)
  })
})
