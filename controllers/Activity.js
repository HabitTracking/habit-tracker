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

    // req.info.progress = {[req.info.startTime]: 0};
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
    const {activityId, userId, activityType: activityTypeId, startTime, frequency, dueDate } = req.info;
    delete req.info.userId; //because updateById is updating whole req.info but userId should not be as string 
    
    const activityType = await this.activityTypeDatabase.getById(activityTypeId);
    if (!activityType) return respond(res, activityTypeResponses.notFound);
    if (activityType.userId && activityType.userId != userId) return respond(res, activityTypeResponses.forbidden);
    
    const activity = await this.activityDatabase.getById(activityId);
    if (!activity) return respond(res, activityResponses.notFound);

    await this.activityDatabase.updateById(activityId, req.info);

    const prevDates = calculateActivityDays(activity.startTime, activity.frequency, activity.dueDate);
    await this.deleteActivityFromCalendarDB(activityId, userId, prevDates);

    const newDates = calculateActivityDays(startTime, frequency, dueDate);
    await this.insertActivityIntoCalendarDB(activityId, userId, newDates);
    
    return respond(res, activityResponses.successful, {activityId});

  }

  async getAll (req, res) {
    let activities = await this.activityDatabase.getByField('userId', req.info.userId);
    if (!activities.length) return respond(res, activityResponses.notFound);
    return respond(res, activityResponses.successful, activities);
  }
  
  async remove (req, res) {
    const {activityId, userId} = req.info;
    const activity = await this.activityDatabase.findByIdAndDelete(activityId);
    if (!activity) return respond(res, activityResponses.notFound, {activityId});
    // const activityId = activity._id.valueOf();
    const dates = calculateActivityDays(activity.startTime, activity.frequency, activity.dueDate);
    await this.deleteActivityFromCalendarDB(activityId, userId, dates);
    
    return respond(res, activityResponses.successful);
  }

  async addProgress (req, res) {
    // try {
    const {activityId, userId, date, amount} = req.info;
    const activity = await this.activityDatabase.getById(activityId);
    if (!activity) return respond(res, activityResponses.notFound);
    if (activity.userId.valueOf() !== userId) return respond(res, activityResponses.forbidden);
    const activityDates = calculateActivityDays(activity.startTime, activity.frequency, activity.dueDate);
    if (!(activityDates.includes(Number(date)))) return respond(res, activityResponses.badRequest);
    if (!activity.progress) {
      activity.progress = {};
      activity.progress[date] = 0;
    }
    let progressTillNow = activity.progress[date];
    if (!progressTillNow) progressTillNow = 0;
    if (progressTillNow + amount > activity.targetAmount) {
      return respond(res, activityResponses.targetExceeded);
    }
    activity.progress[date] = progressTillNow + amount;
    const update = { progress: activity.progress };
    await this.activityDatabase.updateById(activityId, update);
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