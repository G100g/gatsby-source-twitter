const { md5 } = require(`../src/utils`)

jest.mock(`twitter`)

const resultMock = require(`../__mocks__/resultMock`)

const {
  sourceNodes: source,
  setFieldsOnGraphQLNodeType,
} = require(`../src/gatsby-node`)

const { twitterType } = require(`../src/schema`)

const mockGatsbyApi = () => {
  const GatsbyApi = {
    boundActionCreators: {
      nodeObjects: [],
      createNode(nodeObject) {
        this.nodeObjects.push(nodeObject)
      },
    },
    createContentDigest: jest.fn(x => md5(JSON.stringify(x))),
  }

  GatsbyApi.boundActionCreators.createNode = GatsbyApi.boundActionCreators.createNode.bind(
    GatsbyApi.boundActionCreators
  )

  return GatsbyApi
}

const mockSetFieldsOnGraphQLNodeType = name => setFieldsOnGraphQLNodeType =>
  setFieldsOnGraphQLNodeType({
    type: { name },
  })

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

      expect(mock.boundActionCreators.nodeObjects.length).toBe(4)

      // Unabel to recreate the same hash
      mock.boundActionCreators.nodeObjects[0].internal.contentDigest = contentDigest

      expect(mock.boundActionCreators.nodeObjects[0]).toEqual(
        Object.assign({}, item, {
          id,
          children: [],
          parent: `__SOURCE__`,
          internal: {
            type: `twitterTestHash`,
            contentDigest,
          },
        })
      )
    })
  })

  test.each([
    [
      `otherType`,
      mockSetFieldsOnGraphQLNodeType(`otherType`)(setFieldsOnGraphQLNodeType),
      {},
    ],
    [
      `twitterTest`,
      mockSetFieldsOnGraphQLNodeType(`twitterTest`)(setFieldsOnGraphQLNodeType),
      twitterType,
    ],
    [
      `twitterFoo`,
      mockSetFieldsOnGraphQLNodeType(`twitterFoo`)(setFieldsOnGraphQLNodeType),
      twitterType,
    ],
    [
      `twitterzoo`,
      mockSetFieldsOnGraphQLNodeType(`twitterzoo`)(setFieldsOnGraphQLNodeType),
      twitterType,
    ],
    [
      `twitter`,
      mockSetFieldsOnGraphQLNodeType(`twitter`)(setFieldsOnGraphQLNodeType),
      twitterType,
    ],
  ])(`Should return twitterType %s`, (nodeType, result, expected) => {
    expect(result).toEqual(expected)
  })
})
