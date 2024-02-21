const Database = require('../database/Database');
const ActivityModel = require('../models/Activity');
const CalendarModel = require('../models/Calendar');
const calculateActivityDays = require('../hleper/calculateActivityDays');
const respond = require('../hleper/responder');
const activityResponses = require('../responses/activity.json');
const logger = require('../startup/logger');

class Activity {
  constructor () {
    this.activityDatabase = new Database(ActivityModel);
    this.calendarDatabase = new Database(CalendarModel);
  }

  async add (req, res) {
    req.info.progress = {[req.info.startTime]: 0};
    try {
      const result = await this.activityDatabase.create(req.info);
      const activityId = result.toObject()._id.valueOf();
      
      const dates = calculateActivityDays(req.info.startTime, req.info.frequency, req.info.dueDate);
      for (const date of dates) {
        let thisDay = await this.calendarDatabase.getByField('date', date);
        if (!thisDay.length) {
          thisDay = {date: date, activities: [activityId]};
          await this.calendarDatabase.create(thisDay);
        } else {
          let activities = thisDay[0].activities;
          activities = JSON.parse(JSON.stringify(activities));
          activities.push(activityId);

          const update = { activities};
          await this.calendarDatabase.updateByField('date', date, update);
        }  
      }
      return respond(res, activityResponses.created, {activityId});
    } catch (err) {
      logger.error('error in activity add handler', err);
      respond(res, activityResponses.serverError);
    } 
  }

  async addProgress (req, res) {
    try {
      const activity = await this.activityDatabase.getById(req.info.activityId);
      if (activity.userId.valueOf() !== req.info.userId) {
        return respond(res, activityResponses.forbidden);
      }
      let progressTillNow = activity.progress[req.info.date];
      if (!progressTillNow) progressTillNow = 0;
      if (progressTillNow + req.info.amount > activity.targetAmount) {
        return respond(res, activityResponses.targetExceeded);
      }
      const progress = activity.progress;
      progress[req.info.date] = progressTillNow + req.info.amount;
      const update = { progress };
      await this.activityDatabase.updateById(req.info.activityId, update);
      return respond(res, activityResponses.successful);

    } catch (err) {
      logger.error('error in activity addProgress handler', err);
      respond(res, activityResponses.serverError);
    }
  }

  async getAll (req, res) {
    let activities = await this.activityDatabase.getByField('userId', req.info.userId);
    if (!activities.length) return respond(res, activityResponses.notFound);
    return respond(res, activityResponses.successful, activities);
  }

}

module.exports = Activity;