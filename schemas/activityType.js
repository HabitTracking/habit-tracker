const Joi = require('joi');

const add = Joi.object({
  title: Joi.string().min(3).max(255).required(),
});

module.exports = {
  add,
};  