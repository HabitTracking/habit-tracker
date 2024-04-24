const Database = require('../database/Database');
const ActivityTypeModel = require('../models/ActivityType');
const respond = require('../hleper/responder');
const AcTyResponses = require('../responses/activityType.json');

class ActivityType {
  constructor () {
    this.database = new Database(ActivityTypeModel);
  }

  async add (req, res) {
    // try {
    const result = await this.database.create(req.info);
    const activityTypeId = result.toObject()._id.valueOf();
    return respond(res, AcTyResponses.created, {activityTypeId});
    // } catch (err) {
    //   logger.error('error in activityType handler', err);
    //   respond(res, AcTyResponses.serverError);
    // } 
  }

  async showAll (req, res) {
    const userId = req.info.userId;
    // try {
    let userActivityTypes = await this.database.getByField('userId', userId);
    let defaultActivityTypes = await this.database.getByField('userId', null);
    userActivityTypes.unshift(...defaultActivityTypes);
    // if (!userActivityTypes) return respond(res, AcTyResponses.notFound);
    userActivityTypes = userActivityTypes.map(value=>{
      return {
        _id: value._id.valueOf(),
        title: value.title,
      };
    });
    respond(res, AcTyResponses.successful, userActivityTypes);
    // } catch (err) {
    //   logger.error('error in signUp show', err);
    //   respond(res, AcTyResponses.serverError);
    // }
  }
}

module.exports = ActivityType;