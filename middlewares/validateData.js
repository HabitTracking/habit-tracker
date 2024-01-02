const respond = require('../hleper/responder');
const userResponses = require('../responses/userResponses.json');

module.exports = function validate (schema) {
  return (req, res, next) =>{
    const userInfo = req.body;
    const result = schema.validate(userInfo, {abortEarly: false});
    if (result.error) {
      const errors = result.error.details.map(value => value.message);
      respond(res, userResponses.badRequest, {errors});
    }
    else
      next();
  };
};