const respond = require('../hleper/responder');

module.exports = function (Model, fieldToCheck, responses) {
  return async (req, res, next) => {
    // const { email } = req.body;

    try {
      const isExist = await Model.findOne({ [fieldToCheck]: req.body[fieldToCheck] });
      if (isExist) {
        return respond(res, responses.alreadyExist, { [fieldToCheck]: req.body[fieldToCheck] });
      }
      next();
    } catch (error) {
      console.error('Error checking for repetitive:', error);
      respond(res, responses.serverError);
    }
  };
};

// const UserModel = require('../models/User');
// const responses = require('../responses/userResponses.json');
// const respond = require('../hleper/responder');

// async function checkForRepetitiveUser (req, res, next) {
//   const { email } = req.body;

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
