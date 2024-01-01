const Joi = require('joi');
const schema = Joi.object({
  firstname: Joi.string().min(3).max(255).required(),
  lastname: Joi.string().min(2).max(255).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
});
module.exports = schema;