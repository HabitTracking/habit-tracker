const userSchema = require('../schemas/uesr'); 

module.exports = async function validate (req, res, next) {
  const userInfo = req.body;
  const result = userSchema.validate(userInfo, {abortEarly: false});
  if (result.error) {
    return result.error.details.map(value => value.message);
  }
  next();
};