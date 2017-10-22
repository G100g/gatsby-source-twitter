const resultMock = require("./resultMock");
const twitter = jest.genMockFromModule("twitter");

// let resultMock = {}
// twitter.__setResponse = (response) => {
//     resultMock = response;
// };
// twitter.get = () => { return Promise.resolve(resultMock); }

const Twitter = function() {

    


};

Twitter.prototype = {
  get(options) {
    return Promise.resolve(resultMock);
  }
};

module.exports = Twitter;
