const { md5 } = require(`../src/utils`)

jest.mock(`twitter`)

const resultMock = require(`../__mocks__/search-result-mock`)
const reporter = require(`../__mocks__/reporter`)

const { sourceNodes: source } = require(`../src/gatsby-node`)

const cacheNodeObjects = [
  {
    id: 1,
    children: [],
    parent: `__SOURCE__`,
    internal: {
      owner: "gatsby-source-twitter",
      type: `twitterSearchTweetsTestHash`,
      contentDigest: "401b30e3b8b5d629635a5c613cdb7919",
    },
  },
]
const mockGatsbyApi = () => {
  const GatsbyApi = {
    reporter,
    boundActionCreators: {
      nodeObjects: [],
      createNode(nodeObject) {
        this.nodeObjects.push(nodeObject)
      },
      touchNode({ nodeId }) {
        const _this = this
        cacheNodeObjects.forEach(node => {
          if (node.id === nodeId) {
            _this.nodeObjects.push(node)
          }
        })
      },
    },
    createContentDigest: jest.fn(x => md5(JSON.stringify(x))),
    getNodes() {
      return cacheNodeObjects
    },
  }

  GatsbyApi.boundActionCreators.createNode = GatsbyApi.boundActionCreators.createNode.bind(
    GatsbyApi.boundActionCreators
  )

  GatsbyApi.boundActionCreators.touchNode = GatsbyApi.boundActionCreators.touchNode.bind(
    GatsbyApi.boundActionCreators
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

      expect(mock.boundActionCreators.nodeObjects.length).toBe(5)

      // Unabel to recreate the same hash
      mock.boundActionCreators.nodeObjects[1].internal.contentDigest = contentDigest

      // cache node should be equal
      expect(mock.boundActionCreators.nodeObjects[0]).toEqual(
        cacheNodeObjects[0]
      )
      expect(mock.boundActionCreators.nodeObjects[1]).toEqual(
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
