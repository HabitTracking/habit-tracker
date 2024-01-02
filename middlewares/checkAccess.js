const responses = require('../responses/userResponses.json');
const respond = require('../hleper/responder');

async function checkAccess (req, res, next) { //check if user is logged in
  const cookie = req.headers.cookie;
  if (cookie) {
    respond(res, responses.unauthorized, {credentials: req.body});
  }
  else
    next();
}

module.exports = checkAccess;
