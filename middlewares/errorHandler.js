const logger = require('../startup/logger');
const responses = require('../responses/userResponses.json');

module.exports = (err, req, res, next)=>{
  logger.error(err.message, err);
  res.status(responses.serverError.code).json({messsage: responses.serverError.message});
  process.exit();
};