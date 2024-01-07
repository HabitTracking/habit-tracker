const express = require('express');

const validateData = require('../middlewares/validateData');
const checkForRepetitive = require('../middlewares/checkForRepetitive');
const checkAccess = require('../middlewares/checkAccess');
const hashProperty = require('../middlewares/hashProperty');

const UserCotroller = require('../controllers/User');
const userSchema = require('../schemas/user'); 
const UserModel = require('../models/User');
const userResponses = require('../responses/userResponses.json');
const userController = new UserCotroller();
const router = express.Router();

router.post(
  '/signup',
  [checkAccess(false), validateData(userSchema.signUpSchema), checkForRepetitive(UserModel, ['email'], userResponses), hashProperty('password')],
  userController.signUp.bind(userController),
);
router.post(
  '/login',
  [checkAccess(false), validateData(userSchema.loginSchema)],
  userController.login.bind(userController),
);
router.post(
  '/logout',
  [checkAccess(true)],
  userController.logout.bind(userController),
);

module.exports = router;
