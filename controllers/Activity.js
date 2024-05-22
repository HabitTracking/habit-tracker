const Database = require('../database/Database');
const ActivityModel = require('../models/Activity');
const ActivityTypeModel = require('../models/ActivityType');
const CalendarModel = require('../models/Calendar');
const calculateActivityDays = require('../hleper/calculateActivityDays');
const respond = require('../hleper/responder');
const activityResponses = require('../responses/activity.json');
const activityTypeResponses = require('../responses/activityType.json');
const { log } = require('winston');

class Activity {
  constructor () {
    this.activityDatabase = new Database(ActivityModel);
    this.activityTypeDatabase = new Database(ActivityTypeModel);
    this.calendarDatabase = new Database(CalendarModel);
  }

  async add (req, res) {
    const activityType = await this.activityTypeDatabase.getById(req.info.activityType);
    if (!activityType) return respond(res, activityTypeResponses.notFound);
    if (activityType.userId && activityType.userId != req.info.userId) return respond(res, activityTypeResponses.forbidden);

    req.info.progress = {[req.info.startTime]: 0};
    // try {
    const result = await this.activityDatabase.create(req.info);
    const activityId = result.toObject()._id.valueOf();
      
    const dates = calculateActivityDays(req.info.startTime, req.info.frequency, req.info.dueDate);
    await this.insertActivityIntoCalendarDB(activityId, req.info.userId, dates);
    return respond(res, activityResponses.created, {activityId});
    // } catch (err) {
    //   logger.error('error in activity add handler', err);
    //   respond(res, activityResponses.serverError);
    // } 
  }
  
  async update (req, res) {
    const userId = req.info.userId;
    const activityId = req.info.activityId;
    delete req.info.userId; //because updateById is updating whole req.info but userId should not be as string 
    
    const activityType = await this.activityTypeDatabase.getById(req.info.activityType);
    if (!activityType) return respond(res, activityTypeResponses.notFound);
    if (activityType.userId && activityType.userId != userId) return respond(res, activityTypeResponses.forbidden);
    
    const activity = await this.activityDatabase.getById(activityId);
    if (!activity) return respond(res, activityResponses.notFound);

    await this.activityDatabase.updateById(activityId, req.info);

    const prevDates = calculateActivityDays(activity.startTime, activity.frequency, activity.dueDate);
    await this.deleteActivityFromCalendarDB(activityId, userId, prevDates);

    const newDates = calculateActivityDays(req.info.startTime, req.info.frequency, req.info.dueDate);
    await this.insertActivityIntoCalendarDB(activityId, userId, newDates);
    
    return respond(res, activityResponses.successful, {activityId});

  }

  async getAll (req, res) {
    let activities = await this.activityDatabase.getByField('userId', req.info.userId);
    if (!activities.length) return respond(res, activityResponses.notFound);
    return respond(res, activityResponses.successful, activities);
  }
  
  async remove (req, res) {
    const activity = await this.activityDatabase.findByIdAndDelete(req.info.activityId);
    if (!activity) return respond(res, activityResponses.notFound);
    const activityId = activity._id.valueOf();
    const dates = calculateActivityDays(activity.startTime, activity.frequency, activity.dueDate);
    await this.deleteActivityFromCalendarDB(activityId, req.info.userId, dates);
    
    return respond(res, activityResponses.successful);
  }

  async addProgress (req, res) {
    // try {
    const activity = await this.activityDatabase.getById(req.info.activityId);
    if (!activity) return respond(res, activityResponses.notFound);
    if (activity.userId.valueOf() !== req.info.userId) return respond(res, activityResponses.forbidden);
    if (!calculateActivityDays(activity.startTime, activity.frequency, activity.dueDate).includes(req.info.date)) return respond(res, activityResponses.badRequest);
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

    // } catch (err) {
    //   logger.error('error in activity addProgress handler', err);
    //   respond(res, activityResponses.serverError);
    // }
  }

  async deleteActivityFromCalendarDB (activityId, userId, dates) {
    for (const date of dates) {
      let thisDay = await this.calendarDatabase.getByTwoField('userId', userId, 'date', date);
      let activities = thisDay[0].activities;
      activities = JSON.parse(JSON.stringify(activities));
      const index = activities.indexOf(activityId);
      activities.splice(index,1);
      if (activities.length) {
        const update = { activities };
        await this.calendarDatabase.updateByTwoField('userId', userId, 'date', date, update);
      } else {
        const condition = { userId, date};
        await this.calendarDatabase.deleteOne(condition);
      }
    }
  }

  async insertActivityIntoCalendarDB (activityId, userId, dates) {
    for (const date of dates) {
      let thisDay = await this.calendarDatabase.getByTwoField('userId', userId, 'date', date);
      if (!thisDay.length) {
        thisDay = {userId, date: date, activities: [activityId]};
        await this.calendarDatabase.create(thisDay);
      } else {
        let activities = thisDay[0].activities;
        activities = JSON.parse(JSON.stringify(activities));
        activities.push(activityId);
        const update = { activities};
        await this.calendarDatabase.updateByTwoField('userId', userId, 'date', date, update);
      }  
    }
  }

}

module.exports = Activity;