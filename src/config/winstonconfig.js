const winston = require('winston');

const expressWinston = require('express-winston');

const infoLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'info.log' }),
  ],
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

module.exports = {
  infoLogger,
  errorLogger,
};
