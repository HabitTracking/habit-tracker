const Database = require('../database/Database');
const respond = require('../hleper/responder');
const userResponses = require('../responses/userResponses.json');
const UserModel = require('../models/User');

class UserController {
  constructor () {
    this.database = new Database(UserModel);
  }

  async signUp (req, res) {
    try {
      const result = await this.database.create(req.body);
      const userId = result.toObject()._id.valueOf();
      respond(res, userResponses.created, {userId});
    } catch (err) {
      console.log('error in signUp handler', err);
      respond(res, userResponses.serverError);
    }
  }

}

module.exports = UserController;