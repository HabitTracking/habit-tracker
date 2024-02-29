const userRouter = require('../routes/user');
const activityTypeRouter = require('../routes/activityType');
const activityRouter = require('../routes/activity');
const calendarRouter = require('../routes/calendar');
const express = require('express');

module.exports = (app)=>{
  app.use(express.json());
  app.use('/api/user', userRouter);
  app.use('/api/activityType', activityTypeRouter);
  app.use('/api/activity', activityRouter);
  app.use('/api/calendar', calendarRouter);
};
