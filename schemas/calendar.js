const Joi = require('joi');

const get = Joi.object({
  date: Joi.string().required(),
});

module.exports = {
  get,
};  