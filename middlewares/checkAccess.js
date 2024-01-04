const responses = require('../responses/userResponses.json');
const respond = require('../hleper/responder');

module.exports = function checkAccess (hasAccessWithToken) {
  return (req, res, next)=>{
    const token = req.headers.cookie;
    if ((hasAccessWithToken && token) || (!hasAccessWithToken && !token)) {
      next();
    }
    if ((!hasAccessWithToken && token) || (hasAccessWithToken && !token)) {
      respond(res, responses.unauthorized, {credentials: req.body});
    }
  };
};