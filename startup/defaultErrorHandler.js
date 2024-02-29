require('express-async-errors');
const logger = require('./logger');
const responses = require('../responses/userResponses.json');

function handleError (err, req, res, next) {
  logger.error(err.message, err);
  res.status(responses.serverError.code).json({messsage: responses.serverError.message});
  process.exit();
}

module.exports = (app)=>{
  app.use(handleError);
};