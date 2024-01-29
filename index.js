const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/user');
const activityTypeRouter = require('./routes/activityType');
const activityRouter = require('./routes/activity');
const calendarRouter = require('./routes/calendar');
// const clientConfig = require('./middlewares/clientConfig');
const Database = require('./database/Database');

dotenv.config({ path: './.env' });
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

async function start () {
  await Database.connect();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
}

start();
