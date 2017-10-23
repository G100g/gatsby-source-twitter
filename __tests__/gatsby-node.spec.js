const crypto = require("crypto");

const { sanitizeObject } = require("../src/utils");

jest.mock("twitter");

const resultMock = require("../__mocks__/resultMock");
const source = require("../src/gatsby-node").sourceNodes;

const mockGatsbyApi = () => {
  const GatsbyApi = {
    boundActionCreators: {
      nodeObjects: [],
      createNode(nodeObject) {
        this.nodeObjects.push(nodeObject);
      }
    }
  };

  GatsbyApi.boundActionCreators.createNode = GatsbyApi.boundActionCreators.createNode.bind(
    GatsbyApi.boundActionCreators
  );

  return GatsbyApi;
};

test("Should return a promise", () => {
  return source(mockGatsbyApi(), {});
});

test("Should create a node", () => {
  const mock = mockGatsbyApi();
  const item = resultMock.statuses[0];

  return source(mock, {
    credentials: {
      consumer_key: "",
      consumer_secret: "",
      bearer_token: ""
    },
    q: "#testhash"
  }).then(() => {
    expect(mock.boundActionCreators.nodeObjects.length).toBe(4);

    expect(mock.boundActionCreators.nodeObjects[0]).toEqual(Object.assign({}, sanitizeObject(item),{
      id: "250075927172759552",
      children: [],
      parent: null,
      internal: {
        type: `tweet`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(item))
          .digest(`hex`)
      }
    }));
  });
});
