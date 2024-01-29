const Database = require('../database/Database');
const CalendarModel = require('../models/Calendar');
const ActivityModel = require('../models/Activity');
const respond = require('../hleper/responder');
const responses = require('../responses/activity.json');
const moment = require('jalali-moment');
moment().locale('fa');


class ActivityType {
  constructor () {
    this.calendarDatabase = new Database(CalendarModel);
    this.activityDatabase = new Database(ActivityModel);
  }

  async getMonthActivities (req, res) {
    try {
      const startDate = req.query.date;
      const endDate = moment.unix(startDate).add(1,'M').unix();

      const condition = {date: {$gte: startDate, $lt: endDate}};
      let days = await this.calendarDatabase.conditionalGet(condition);
      const report= {};
      for (const day of days) {
        let allDays = JSON.parse(JSON.stringify(day.activities));
        report[day.date] = allDays.length;
      }
      // days = days.map(element =>{
      //   return element.date;
      // });
      return respond(res, responses.successful, report);
    } catch (err) {
      console.log('error in activityType handler', err);
    } 
  }
  async getDayActivities (req, res) {
    try {
      const todayDate = req.query.date;
      const tomorrowDate = moment.unix(todayDate).add(1,'d').unix();
      const todayActivities = [];

      const condition = {date: {$gte: todayDate, $lt: tomorrowDate}};
      let activities = await this.calendarDatabase.conditionalGet(condition);
      let activityIDs = activities[0].activities;
      activityIDs = JSON.parse(JSON.stringify(activityIDs));

      for (const activityId of activityIDs) {
        let activity = await this.activityDatabase.getById(activityId);
        activity = activity._doc;
        let progress;
        for (const [date] of Object.entries(activity.progress)) {
          if (date>=todayDate && date<tomorrowDate) {
            progress = activity.progress[date];
            break;
          }
        }
        if (!progress) progress = 0;
        const progressPercentage = Math.ceil(progress*100/activity.targetAmount);
        activity.progress = progressPercentage;
        todayActivities.push(activity);
      }
      return respond(res, responses.successful, todayActivities);
    } catch (err) {
      console.log('error in activityType handler', err);
    } 
  }

}

module.exports = ActivityType;