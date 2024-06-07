const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Database = require('../database/Database');
const respond = require('../hleper/responder');
const userResponses = require('../responses/userResponses.json');
const UserModel = require('../models/User');
const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
const logger = require('../startup/logger');
dotenv.config({ path: './.env' });

class UserController {
  constructor () {
    this.database = new Database(UserModel);
  }

  async signUp (req, res) {
    // try {
    req.info.theme = process.env.DEFAULT_THEME;
    const result = await this.database.create(req.info);
    const userId = result.toObject()._id.valueOf();
    return respond(res, userResponses.created, {userId});
    // } catch (err) {
    //   logger.error('error in signUp handler', err);
    //   respond(res, userResponses.serverError);
    // }
  }

  async login (req, res) {
    const credentials = req.info;
    const userData = (await this.database.getByField('email', credentials.email))[0];
    if (!userData) return respond(res, userResponses.unauthorized, {credentials});
    const isPasswordValid = await bcrypt.compare(credentials.password, userData.password);
    if (!isPasswordValid) return respond(res, userResponses.unauthorized, {credentials});
    const token = jwt.sign({ userId: userData._id, email: userData.email }, process.env.jwt_secretKey);
    // const expireTime = new Date(new Date().getTime() + 60 * 60 * 1000).toUTCString();
    // res.setHeader(
    //   'Set-Cookie',
    //   `token=${token}; HttpOnly; path=/; Expires= ${expireTime}`,
    // );
    // res.header('Authorization', `Bearer ${token}`);
    res.cookie(process.env.TOKEN_NAME, token, { maxAge: 100 * 60 * 60 * 1000 });
    const {firstname, lastname, email, theme} = userData;
    return respond(res, userResponses.loginSuccess, {firstname, lastname, email, theme}); 
  }

  async logout (req, res) {
    // res.setHeader(
    //   'Set-Cookie',
    //   'token=deleted; HttpOnly; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
    // );
    res.clearCookie(process.env.TOKEN_NAME);
    return respond(res, userResponses.logoutSuccess);
  }

  async setTheme (req, res) {
    const update = {theme: req.info.theme};
    await this.database.updateById(req.info.userId, update);
    return respond(res, userResponses.successful);
  }

  async getTheme (req, res) {
    const user = await this.database.getById(req.info.userId);
    return respond(res, userResponses.successful, {theme: user.theme});
  }

  async forgotPassword (req, res) {
    const email = req.info.email;
    const users = await this.database.getByField('email', email);
    if (!users.length) return respond(res, userResponses.notFound);
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpire = new Date();
    otpExpire.setMinutes(otpExpire.getMinutes() + 2);

    
    // try {
    const update = {otp, otpExpire};
    // try {
    await this.database.updateById(users[0]._id.valueOf(), update);
    //   console.log('yes');

    // } catch (err) {
    //   console.log(err);
    // }
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Habtic Reset Password',
      text: `otp code reset password: ${otp} .\nexpires in 2 minutes.`,
    });
    return respond(res, userResponses.successful);

  }

}

module.exports = UserController;