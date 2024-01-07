const Database = require('../database/Database');
const ActivityTypeModel = require('../models/ActivityType');
const respond = require('../hleper/responder');
const AcTyResponses = require('../responses/activityTypeResponses.json');

class ActivityType {
  constructor () {
    this.database = new Database(ActivityTypeModel);
  }

  async add (req, res) {
    try {
      const result = await this.database.create(req.info);
      const activityTypeId = result.toObject()._id.valueOf();
      respond(res, AcTyResponses.created, {activityTypeId});
    } catch (err) {
      console.log('error in activityType handler', err);
      respond(res, AcTyResponses.serverError);
    } 
  }

  async showAll (req, res) {
    const userId = req.info.userId;
    try {
      let activityTypes = await this.database.getByField('userId', userId);
      if (!activityTypes) return respond(res, AcTyResponses.notFound);
      activityTypes = activityTypes.map(value=>{
        return {
          _id: value._id.valueOf(),
          title: value.title,
        };
      });
      respond(res, AcTyResponses.successful, activityTypes);
      console.log(activityTypes);
    } catch (err) {
      console.log('error in signUp show', err);
      respond(res, AcTyResponses.serverError);
    }
  }
}

module.exports = ActivityType;