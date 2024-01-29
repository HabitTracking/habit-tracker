const Database = require('../database/Database');
const ActivityModel = require('../models/Activity');
const CalendarModel = require('../models/Calendar');
const calculateActivityDays = require('../hleper/calculateActivityDays');
const respond = require('../hleper/responder');
const activityResponses = require('../responses/activity.json');

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
          // const dayInfo = thisDay._doc;
          let  activities = thisDay[0].activities;
          activities = JSON.parse(JSON.stringify(activities));
          activities.push(activityId);

          const update = { activities};
          await this.calendarDatabase.updateByField('date', date, update);
        }  
      }
      return respond(res, activityResponses.created, {activityId});
    } catch (err) {
      console.log('error in activity handler', err);
      respond(res, activityResponses.serverError);
    } 
  }

  async addProgress (req, res) {
    const activity = await this.activityDatabase.getById(req.info.activityId);
    const activityInfo = activity._doc;
    let progressTillNow = activityInfo.progress[req.info.date];
    if (!progressTillNow) progressTillNow = 0;
    if (progressTillNow + req.info.amount > activityInfo.targetAmount) {
      return respond(res, activityResponses.targetExceeded);
    }
    const progress = activityInfo.progress;
    progress[req.info.date] = progressTillNow + req.info.amount;
    const update = { progress };
    await this.activityDatabase.updateById(req.info.activityId, update);
    return respond(res, activityResponses.successful);

    // const activity = await this.database.getById(req.info.activityId);
    // const activityInfo = activity._doc;
    // let progressTillNow = activityInfo.progress[req.info.date];
    // if (!progressTillNow) progressTillNow = 0;
    // if (progressTillNow + req.info.amount > activityInfo.targetAmount) {
    //   return respond(res, activityResponses.targetExceeded);
    // }
    // activityInfo.progress[req.info.date] = progressTillNow + req.info.amount;
    // let a = await activity.save();
    // console.log(a);

  }

  async getAll (req, res) {
    let activities = await this.activityDatabase.getByField('userId', req.info.userId);
    if (!activities.length) return respond(res, activityResponses.notFound);
    return respond(res, activityResponses.successful, activities);
  }

}

module.exports = Activity;