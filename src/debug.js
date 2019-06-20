const fs = require(`fs`)

function saveResult(queryName, results) {
  fs.writeFileSync(
    `./tweets-${queryName}.json`,
    JSON.stringify(results, null, 4),
    {
      encoding: `utf8`,
    }
  )
}

module.exports = {
  saveResult,
}
