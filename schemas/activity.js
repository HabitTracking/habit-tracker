const Joi = require('joi');

const add = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  note: Joi.string().max(1024),
  color: Joi.string().length(6).default('ffffff'),
  activityType: Joi.string().required(), //id
  startTime: Joi.string().required(), //timestamp
  frequency: Joi.number().min(0).required(), //0 1 3 7 30
  dueDate: Joi.string().required(), //timestamp
  targetUnit: Joi.string().required(), //کیلومتر
  targetAmount: Joi.number().min(0).required(), // 10
});
const progress = Joi.object({
  activityId: Joi.string().required(),
  date: Joi.string().required(),
  amount: Joi.number().min(0).required(),
});

module.exports = {
  add,
  progress,
};  