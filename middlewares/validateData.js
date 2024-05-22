const respond = require('../hleper/responder');
const userResponses = require('../responses/userResponses.json');

module.exports = function validate (schema, fieldToValidate) {
  return (req, res, next) =>{
    let info = {};
    fieldToValidate.forEach(element => {
      info = {...info, ...req[element]};
    });

    const result = schema.validate(info, {abortEarly: false});
    if (result.error) {
      const errors = result.error.details.map(value => value.message);
      respond(res, userResponses.badRequest, {errors});
    }
    else {
      req.info ??= {};
      req.info = {...req.info, ...info};
      next();
    }
  };
};