function sanitizeObject(obj) {
  if (!obj) return obj;
  Object.keys(obj).forEach(key => {
    if (obj[key] === null) {
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

module.exports = {
  sanitizeObject
};