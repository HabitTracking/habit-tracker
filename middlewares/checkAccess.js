const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
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
          jwt.verify(token, process.env.jwt_secretKey);
          next();
          // userId, email

          // const isExist = await UserModel.findById(decoded.userId);
          // console.log(1, isExist);
          // if (!isExist) {
          //   return respond(res, responses.unauthorized, {credentials: req.body});
          // }

        } catch (err) {
          console.log('error in checkAccess');
          return respond(res, responses.unauthorized, {credentials: req.body});
        }
      }
      else {
        next();
      }
    }
    if ((!hasAccessWithToken && token) || (hasAccessWithToken && !token)) {
      return respond(res, responses.unauthorized, {credentials: req.body});
    }
  };
};