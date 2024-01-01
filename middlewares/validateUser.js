const respond = require('../hleper/responder');
const userSchema = require('../schemas/uesr'); 
const userResponses = require('../responses/userResponses.json');

module.exports = function validate (req, res, next) {
  const userInfo = req.body;
  const result = userSchema.validate(userInfo, {abortEarly: false});
  if (result.error) {
    const errors = result.error.details.map(value => value.message);
    respond(res, userResponses.badRequest, {errors});
  }
  else
    next();
};