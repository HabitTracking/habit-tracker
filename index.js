const express = require('express');
const logger = require('./startup/logger');
const Database = require('./database/Database');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = express();


require('./startup/uncaughtErrors')();
require('./startup/corsConfig')(app);
require('./startup/routes')(app);
require('./startup/defaultErrorHandler')(app);

async function start () {
  await Database.connect();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    logger.info(`server is listening on port ${PORT}`);
  });
}

start();
