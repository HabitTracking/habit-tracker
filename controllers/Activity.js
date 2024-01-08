const Database = require('../database/Database');
const ActivityModel = require('../models/Activity');
const respond = require('../hleper/responder');
const activityResponses = require('../responses/activity.json');

class Activity {
  constructor () {
    this.database = new Database(ActivityModel);
  }

  async add (req, res) {
    req.info.progress = {[req.info.startTime]: 0};
    try {
      const result = await this.database.create(req.info);
      const activityId = result.toObject()._id.valueOf();
      respond(res, activityResponses.created, {activityId});
    } catch (err) {
      console.log('error in activity handler', err);
      respond(res, activityResponses.serverError);
    } 
  }

  async addProgress (req, res) {
    const activity = await this.database.getById(req.info.activityId);
    const activityInfo = activity._doc;
    let progressTillNow = activityInfo.progress[req.info.date];
    if (!progressTillNow) progressTillNow = 0;
    if (progressTillNow + req.info.amount > activityInfo.targetAmount) {
      return respond(res, activityResponses.targetExceeded);
    }
    const progress = activity.progress;
    progress[req.info.date] = progressTillNow + req.info.amount;
    const update = { progress };
    await activity.updateOne(update);
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
    let activities = await this.database.getByField('userId', req.info.userId);
    if (!activities.length) return respond(res, activityResponses.notFound);
    return respond(res, activityResponses.successful, activities);
  }

}

module.exports = Activity;