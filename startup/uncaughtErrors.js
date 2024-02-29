const logger = require('./logger');

module.exports = ()=>{
  process.on('uncaughtException', (err)=>{
    console.log(11);
    logger.error('uncaughtException', err);
    process.exit();
  });
  process.on('unhandledRejection', (err)=>{
    console.log(22);
    logger.error('unhandledRejection', err);
    process.exit();
  });
};  
