jest.mock(`twitter`)

const Twitter = require(`twitter`)
const getTweet = require(`../src/twitter`)

const { statuses: mockTweets } = require(`../__mocks__/resultMock`)

describe.only(`Twitter`, () => {
  test(`Should return first tweets results`, async () => {
    const options = {
      endpoint: `search/tweets`,
      params: {
        q: `#kitten`,
      },
    }
    var mockClient = new Twitter()
    mockClient.numberOfPageResult = 2

    const tweets = await getTweet(mockClient, options)

    expect(tweets).toHaveLength(4)

    expect(tweets[0]).toEqual(mockTweets[0])
    expect(tweets[1]).toEqual(mockTweets[1])
    expect(tweets[2]).toEqual(mockTweets[2])
    expect(tweets[3]).toEqual(mockTweets[3])
  })

  test(`Should return all tweets results`, async () => {
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
})
