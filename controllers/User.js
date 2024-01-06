const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Database = require('../database/Database');
const respond = require('../hleper/responder');
const userResponses = require('../responses/userResponses.json');
const UserModel = require('../models/User');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

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

  async login (req, res) {
    const credentials = req.body;
    const userData = await this.database.getByField('email', credentials.email);
    if (userData) {
      const isPasswordValid = await bcrypt.compare(credentials.password, userData.password);
      if (!isPasswordValid) return respond(res, userResponses.unauthorized, {credentials});
      const token = jwt.sign({ userId: userData._id, email: userData.email }, process.env.jwt_secretKey, { expiresIn: '1h' });
      // const expireTime = new Date(new Date().getTime() + 60 * 60 * 1000).toUTCString();
      // res.setHeader(
      //   'Set-Cookie',
      //   `token=${token}; HttpOnly; path=/; Expires= ${expireTime}`,
      // );
      // res.header('Authorization', `Bearer ${token}`);
      res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
      respond(res, userResponses.loginSuccess, {firstname: userData.firstname, lastname: userData.lastname, email: userData.email}); 
    } else {
      respond(res, userResponses.unauthorized, {credentials});
    }
  }

  async logout (req, res) {
    // res.setHeader(
    //   'Set-Cookie',
    //   'token=deleted; HttpOnly; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
    // );
    res.clearCookie('token');
    respond(res, userResponses.logoutSuccess);
  }

}

module.exports = UserController;