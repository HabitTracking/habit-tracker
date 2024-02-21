const winston = require('winston');
const {format} = winston;
module.exports = winston.createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new winston.transports.Console({      
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: 'logs.log'}),
  ],
});
