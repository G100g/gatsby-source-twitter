const crypto = require(`crypto`)

function sanitizeObject(obj) {
  if (!obj) return ``

  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined) {
      obj[key] = ``
    } else if (key === `id`) {
      obj[key] = `${obj[key]}`
      // } else if (typeof obj[key] === "number") {

      //   obj[key] = `${obj[key]}`;
    } else if (typeof obj[key] === `object`) {
      obj[key] = sanitizeObject(obj[key])
    }
  })

  return obj
}

function md5(str) {
  return crypto
    .createHash(`md5`)
    .update(str)
    .digest(`hex`)
}

function camelCase(txt) {
  return txt
    .replace(/([^A-Z0-9]+)/gi, ` `)
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase()
    })
    .replace(/\s/g, ``)
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase()
    })
}

const logNamespace = `\x1b[36mtwitter\x1b[0m`
const debugNamespace = `\x1b[33mtwitter\x1b[0m`
const errorNamespace = `\x1b[31mtwitter\x1b[0m`

function log(msg, namespace = logNamespace) {
  console.log(`${namespace} ${msg}`)
}

function logDebug(msg) {
  if (process.env.DEBUG) {
    log(msg, debugNamespace)
  }
}

function logError(msg) {
  log(msg, errorNamespace)
}

function decrementHugeNumberBy1(n) {
  // make sure s is a string, as we can't do math on numbers over a certain size
  n = n.toString()
  var allButLast = n.substr(0, n.length - 1)
  var lastNumber = n.substr(n.length - 1)

  if (lastNumber === `0`) {
    return decrementHugeNumberBy1(allButLast) + `9`
  } else {
    var finalResult = allButLast + (parseInt(lastNumber, 10) - 1).toString()
    return trimLeft(finalResult, `0`)
  }
}

function trimLeft(s, c) {
  var i = 0
  while (i < s.length && s[i] === c) {
    i++
  }

  return s.substring(i)
}

module.exports = {
  decrementHugeNumberBy1,
  sanitizeObject,
  md5,
  log,
  logDebug,
  logError,
  camelCase,
}
