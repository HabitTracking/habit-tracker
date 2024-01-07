const respond = require('../hleper/responder');
const userResponses = require('../responses/userResponses.json');

module.exports = function validate (schema) {
  return (req, res, next) =>{
    const info = req.body;
    const result = schema.validate(info, {abortEarly: false});
    if (result.error) {
      const errors = result.error.details.map(value => value.message);
      respond(res, userResponses.badRequest, {errors});
    }
    else {
      req.info = req.info ? req.info : {};
      for (const [key, value] of Object.entries(info)) {
        req.info[key] = value;
      }
      next();
      // req.info = info;
    }
  };
};