const Joi = require('joi');

const get = Joi.object({
  date: Joi.string().min(3).max(255).required(),
});

module.exports = {
  get,
};  