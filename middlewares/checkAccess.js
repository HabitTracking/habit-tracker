const jwt = require('jsonwebtoken');
const responses = require('../responses/userResponses.json');
const respond = require('../hleper/responder');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

module.exports = function checkAccess (hasAccessWithToken) {
  return async (req, res, next)=>{
    //AmyT=salam; habticToken=eyJhbGci
    let {cookie} = req.headers;
    let cookies = cookie?.split(';');
    cookies = cookies?.filter(item=>{
      return item.includes(process.env.TOKEN_NAME);
    });
    cookies = cookies ? cookies[0] : null;
    const tokenKey = cookies?.split('=')[0];
    const tokenValue = cookies?.split('=')[1];
    // String().
    // const isToken
    if ((hasAccessWithToken && tokenKey) || (!hasAccessWithToken && !tokenKey)) {
      if (tokenKey) {
        // const token = cookie.split('=')[1];
        try {
          const user = jwt.verify(tokenValue, process.env.jwt_secretKey);
          req.info ??= {};
          req.info.userId = user.userId;
          next();
        } catch (err) {
          return respond(res, responses.forbidden, {credentials: req.info});
        }
      }
      else {
        next();
      }
    }
    if ((!hasAccessWithToken && cookie) || (hasAccessWithToken && !cookie)) {
      return respond(res, responses.forbidden, {credentials: req.info});
    }
  };
};