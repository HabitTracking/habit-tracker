const respond = require('../hleper/responder');

module.exports = function (Model, fieldToCheck, responses) {
  return async (req, res, next) => {
    // try {
    const condition = {};
    for (const key of fieldToCheck) {
      condition[key] = req.info[key];
    }
    const isExist = await Model.findOne(condition);
    if (isExist) {
      return respond(res, responses.alreadyExist, { [fieldToCheck]: req.info[fieldToCheck] });
    }
    next();
    // } catch (error) {
    //   console.error('Error checking for repetitive:', error);
    //   respond(res, responses.serverError);
    // }
  };
};

// const UserModel = require('../models/User');
// const responses = require('../responses/userResponses.json');
// const respond = require('../hleper/responder');

// async function checkForRepetitiveUser (req, res, next) {
//   const { email } = req.info;

//   try {
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return respond(res, responses.alreadyExist, {email});
//     }
//     next();
//   } catch (error) {
//     console.error('Error checking for repetitive user:', error);
//     respond(res, responses.serverError);
//   }
// }

// module.exports = checkForRepetitiveUser;
