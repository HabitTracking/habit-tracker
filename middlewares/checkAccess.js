const jwt = require('jsonwebtoken');
const responses = require('../responses/userResponses.json');
const respond = require('../hleper/responder');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

module.exports = function checkAccess (hasAccessWithToken) {
  return async (req, res, next)=>{
    let token = req.headers.cookie;
    if ((hasAccessWithToken && token) || (!hasAccessWithToken && !token)) {
      if (token) {
        token = token.split('=')[1];
        try {
          const user = jwt.verify(token, process.env.jwt_secretKey);
          req.info = req.info ? req.info : {};
          req.info.userId = user.userId;
          next();
          // userId, email

          // const isExist = await UserModel.findById(decoded.userId);
          // console.log(1, isExist);
          // if (!isExist) {
          //   return respond(res, responses.unauthorized, {credentials: req.info});
          // }

        } catch (err) {
          console.log('error in checkAccess');
          return respond(res, responses.unauthorized, {credentials: req.info});
        }
      }
      else {
        next();
      }
    }
    if ((!hasAccessWithToken && token) || (hasAccessWithToken && !token)) {
      return respond(res, responses.unauthorized, {credentials: req.info});
    }
  };
};