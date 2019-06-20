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
  return txt.replace(/([^A-Z0-9]+)/gi, ` `).replace(/\s(.)/g, function ($1) {
    return $1.toUpperCase();
  }).replace(/\s/g, ``).replace(/^(.)/, function ($1) {
    return $1.toLowerCase();
  });
}

const logNamespace = `\x1b[36mtwitter\x1b[0m`;
const debugNamespace = `\x1b[33mtwitter\x1b[0m`;
const errorNamespace = `\x1b[31mtwitter\x1b[0m`;

function log(msg, namespace = logNamespace) {
  console.log(`${namespace} ${msg}`);
}

function logDebug(msg) {
  if (process.env.DEBUG) {
    log(msg, debugNamespace);
  }
}

function logError(msg) {
  log(msg, errorNamespace);
}

module.exports = {
  sanitizeObject,
  md5,
  log,
  logDebug,
  logError,
  camelCase
};