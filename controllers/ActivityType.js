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
      const result = await this.database.create(req.body);
      const userId = result.toObject()._id.valueOf();
      respond(res, AcTyResponses.created, {userId});
    } catch (err) {
      console.log('error in activityType handler', err);
      respond(res, AcTyResponses.serverError);
    } 
  }

  async show (req, res) {
    const id = req.params.id;
    if (id) {
      let activityType = await this.database.getById(id);
      activityType =  {
        _id: activityType._id.valueOf(),
        title: activityType.title,
      };
      respond(res, AcTyResponses.successful, activityType);
      console.log(activityType);
    } else {
      let activityTypes = await this.database.getById();
      activityTypes = activityTypes.map(value=>{
        return {
          _id: value._id.valueOf(),
          title: value.title,
        };
      });
      respond(res, AcTyResponses.successful, activityTypes);
      console.log(activityTypes);
    }
  }
}

module.exports = ActivityType;