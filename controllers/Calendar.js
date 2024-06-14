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
    // try {
    const startDate = req.info.date;
    const endDate = moment.unix(startDate).add(1,'M').unix();

    let days = await this.calendarDatabase.getInSpan('userId', req.info.userId, 'date', startDate, endDate);
    if (days.length === 0) return respond(res, responses.notFound);
    const monthActivities= {};
    for (const day of days) {
      let dayActivities = JSON.parse(JSON.stringify(day.activities));
      monthActivities[day.date] = dayActivities.length;
    }
    return respond(res, responses.successful, monthActivities);
    // } catch (err) {
    //   logger.error('error in getMonthActivities handler', err);
    //   respond(res, responses.serverError);
    // } 
  }
  async getDayActivities (req, res) {
    // try {
    const todayDate = req.info.date;
    const tomorrowDate = moment.unix(todayDate).add(1,'d').unix();
    const todayActivities = [];

    let activities = await this.calendarDatabase.getInSpan('userId', req.info.userId, 'date', todayDate, tomorrowDate);
    if (activities.length === 0) return respond(res, responses.notFound);
    let activitiesID = activities[0].activities;
    activitiesID = JSON.parse(JSON.stringify(activitiesID));

    for (const activityId of activitiesID) {
      let activity = await this.activityDatabase.getById(activityId);
      let progress = 0;
      if (activity.progress) {
        for (const [activityTime, actuvityProgress] of Object.entries(activity.progress)) {
          if (activityTime>=todayDate && activityTime<tomorrowDate) {
            progress = actuvityProgress;
            break;
          }
        }
      }
      // for (const [activityTime] of Object.entries(activity.progress)) {
      //   if (activityTime>=todayDate && activityTime<tomorrowDate) {
      //     progress = activity.progress[activityTime];
      //     break;
      //   }
      // }
      const progressPercentage = Math.ceil(progress*100/activity.targetAmount);
      activity.progress = progressPercentage;
      todayActivities.push(activity);
    }
    return respond(res, responses.successful, todayActivities);
    // } catch (err) {
    //   logger.error('error in getDayActivities handler', err);
    //   respond(res, responses.serverError);
    // } 
  }

}

module.exports = ActivityType;