// const twitter = jest.genMockFromModule(`twitter`)

// let resultMock = {}
// twitter.__setResponse = (response) => {
//     resultMock = response;
// };
// twitter.get = () => { return Promise.resolve(resultMock); }

const searchResultMock = require(`./search-result-mock`)

const Twitter = function() {
  this.id = new Date().getTime()
}

const handles = {
  "favorites/list": function() {
    const resultMock = require(`./favorite-result-mock`)
    return resultMock
  },
  "statuses/show": function() {
    const resultMock = require(`./single-result-mock`)
    return resultMock
  },
  "statuses/oembed": function() {
    const resultMock = require(`./oembed-result-mock`)
    return resultMock
  },
  "statuses/lookup": function() {
    const resultMock = require(`./lookup-result-mock`)
    return resultMock
  },
  "statuses/user_timeline": function() {
    const resultMock = require(`./timeline-result-mock`)
    return resultMock
  },
  "search/tweets": function() {
    const resultMock = { ...searchResultMock }

    resultMock.search_metadata = {
      ...resultMock.search_metadata,
      count: this.__counterPageResults,
    }

    if (this.__counterPageResults === this.numberOfPageResult - 1) {
      delete resultMock.search_metadata.next_results
    }

    this.__counterPageResults++
    return resultMock
  },
  "lists/members": function() {
    const resultMock = require(`./lists-members`)
    return resultMock
  },
}

const getHandle = (endpoint, client) => handles[endpoint].bind(client) || false

Twitter.prototype = {
  get(endpoint, params) {
    this.__params = params
    const mockHandle = getHandle(endpoint, this)
    if (mockHandle) {
      return Promise.resolve(mockHandle())
    } else {
      return Promise.resolve([])
    }
  },

  __params: {},
  __counterPageResults: 0,
  numberOfPageResult: 1,
}

module.exports = Twitter
