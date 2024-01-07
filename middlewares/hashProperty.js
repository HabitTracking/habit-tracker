const bcrypt = require('bcrypt');

module.exports = function (field) {
  return async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    req.info[field] = await bcrypt.hash(req.info[field], salt);
    next();
  };
};