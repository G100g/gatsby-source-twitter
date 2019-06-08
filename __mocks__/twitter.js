const resultMock = require(`./resultMock`)
// const twitter = jest.genMockFromModule(`twitter`)

// let resultMock = {}
// twitter.__setResponse = (response) => {
//     resultMock = response;
// };
// twitter.get = () => { return Promise.resolve(resultMock); }

const Twitter = function() {}

Twitter.prototype = {
  get() {
    resultMock.search_metadata = {
      ...resultMock.search_metadata,
      count: this.__counterPageResults,
    }

    if (this.__counterPageResults === this.numberOfPageResult - 1) {
      delete resultMock.search_metadata.next_results
      /*
          search_metadata: {
        max_id: 250126199840518145,
        since_id: 24012619984051000,
        refresh_url: `?since_id=250126199840518145&q=%23freebandnames&result_type=mixed&include_entities=1`,
        next_results: `?max_id=249279667666817023&q=%23freebandnames&count=4&include_entities=1&result_type=mixed`,
        count: 4,
        completed_in: 0.035,
        since_id_str: `24012619984051000`,
        query: `%23freebandnames`,
        max_id_str: `250126199840518145`,
      },
      */
    }

    this.__counterPageResults++

    return Promise.resolve(resultMock)
  },

  numberOfPageResult: 1,
  __counterPageResults: 0,
}

module.exports = Twitter
