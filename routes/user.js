const express = require('express');
const validateData = require('../middlewares/validateData');
const checkForRepetitiveUser = require('../middlewares/checkForRepetitiveUser');
const checkAccess = require('../middlewares/checkAccess');
const hashProperty = require('../middlewares/hashProperty');
const UserCotroller = require('../controllers/User');
const userSchema = require('../schemas/user'); 

const userController = new UserCotroller();
const router = express.Router();

router.post(
  '/signup',
  [checkAccess(false), validateData(userSchema.signUpSchema), checkForRepetitiveUser, hashProperty('password')],
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
