const express = require('express');
const cors = require('cors');
const logger = require('./startup/logger');
require('express-async-errors');
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./routes/user');
const activityTypeRouter = require('./routes/activityType');
const activityRouter = require('./routes/activity');
const calendarRouter = require('./routes/calendar');
const Database = require('./database/Database');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

process.on('uncaughtException', (err)=>{
  logger.error('uncaughtException', err);
  process.exit();
});
process.on('unhandledRejection', (err)=>{
  logger.error('unhandledRejection', err);
  process.exit();
});

const app = express();
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/activityType', activityTypeRouter);
app.use('/api/activity', activityRouter);
app.use('/api/calendar', calendarRouter);
app.use(errorHandler);

async function start () {
  await Database.connect();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    logger.info(`server is listening on port ${PORT}`);
  });
}

start();
