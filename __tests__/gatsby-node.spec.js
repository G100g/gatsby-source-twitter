const { md5 } = require(`../src/utils`)

jest.mock(`twitter`)

const resultMock = require(`../__mocks__/search-result-mock`)
const reporter = require(`../__mocks__/reporter`)

const { sourceNodes: source } = require(`../src/gatsby-node`)

const mockGatsbyApi = () => {
  const GatsbyApi = {
    reporter,
    actions: {
      nodeObjects: [],
      createNode(nodeObject) {
        this.nodeObjects.push(nodeObject)
      },
    },
    createContentDigest: jest.fn(x => md5(JSON.stringify(x))),
  }

  GatsbyApi.actions.createNode = GatsbyApi.actions.createNode.bind(
    GatsbyApi.actions
  )

  return GatsbyApi
}

describe(`Source`, () => {
  test(`Should return a promise`, () => source(mockGatsbyApi(), {}))

  test(`Should create a node`, () => {
    const mock = mockGatsbyApi()
    const item = resultMock.statuses[0]

    return source(mock, {
      credentials: {
        consumer_key: ``,
        consumer_secret: ``,
        bearer_token: ``,
      },
      queries: {
        testHash: {
          endpoint: `search/tweets`,
          params: {
            q: `#kitten`,
          },
        },
      },
    }).then(() => {
      const contentDigest = md5(JSON.stringify(item))
      const id = md5(item.id_str)

      expect(mock.actions.nodeObjects.length).toBe(4)

      // Unabel to recreate the same hash
      mock.actions.nodeObjects[0].internal.contentDigest = contentDigest

      expect(mock.actions.nodeObjects[0]).toEqual(
        Object.assign({}, item, {
          id,
          children: [],
          parent: `__SOURCE__`,
          internal: {
            type: `twitterSearchTweetsTestHash`,
            contentDigest,
          },
        })
      )
    })
  })
})
