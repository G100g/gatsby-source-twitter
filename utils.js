"use strict";

const crypto = require(`crypto`);

function sanitizeObject(obj) {
  if (!obj) return ``;
  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined) {
      obj[key] = ``;
    } else if (key === `id`) {
      obj[key] = `${obj[key]}`; // } else if (typeof obj[key] === "number") {
      //   obj[key] = `${obj[key]}`;
    } else if (typeof obj[key] === `object`) {
      obj[key] = sanitizeObject(obj[key]);
    }
  });
  return obj;
}

function md5(str) {
  return crypto.createHash(`md5`).update(str).digest(`hex`);
}

function camelCase(txt) {
  return txt.replace(/\s(.)/g, function ($1) {
    return $1.toUpperCase();
  }).replace(/\s/g, ``).replace(/^(.)/, function ($1) {
    return $1.toLowerCase();
  });
}

const logNamespace = `\x1b[36mtwitter\x1b[0m`;
const debugNamespace = `\x1b[33mtwitter\x1b[0m`;

function log(msg, namespace = logNamespace) {
  console.log(`\n${namespace} ${msg}`);
}

function logDebug(msg) {
  if (process.env.DEBUG) {
    log(msg, debugNamespace);
  }
}

module.exports = {
  sanitizeObject,
  md5,
  log,
  logDebug,
  camelCase
};