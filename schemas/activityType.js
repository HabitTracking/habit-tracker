const Joi = require('joi');

const add = Joi.object({
  title: Joi.string().min(3).max(255).required(),
});
const remove = Joi.object({
  activityTypeId :Joi.string().required(), //in params
});
const update = Joi.object({
  activityTypeId: Joi.string().required(), //in params, others in body
  title: Joi.string().min(3).max(255).required(),
});

module.exports = {
  add,
  update,
  remove,
};  