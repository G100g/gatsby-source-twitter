const crypto = require("crypto");

function sanitizeObject(obj) {
  if (!obj) return "";

  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined) {
      obj[key] = ``;
    } else if (key === "id") {
      obj[key] = `${obj[key]}`;
      // } else if (typeof obj[key] === "number") {

      //   obj[key] = `${obj[key]}`;
    } else if (typeof obj[key] === "object") {
      obj[key] = sanitizeObject(obj[key]);
    }
  });

  return obj;
}

function md5(str) {
  return crypto.createHash(`md5`).update(str).digest(`hex`);
}

module.exports = {
  sanitizeObject,
  md5
};