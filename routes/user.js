const express = require('express');
const validateData = require('../middlewares/validateData');
const checkForRepetitiveUser = require('../middlewares/checkForRepetitiveUser');
const checkAccess = require('../middlewares/checkAccess');
const UserCotroller = require('../controllers/User');
const userSchema = require('../schemas/user'); 

const userController = new UserCotroller();
const router = express.Router();

router.post(
  '/signup',
  [checkAccess, validateData(userSchema.signUpSchema), checkForRepetitiveUser],
  userController.signUp.bind(userController),
);
router.get(
  '/login',
  [checkAccess, validateData(userSchema.loginSchema), checkAccess],
  userController.login.bind(userController),
);

module.exports = router;
