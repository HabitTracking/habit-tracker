const express = require('express');
const validateUser = require('../middlewares/validateUser');
const checkForRepetitiveUser = require('../middlewares/checkForRepetitiveUser');
const UserCotroller = require('../controllers/User');

const userController = new UserCotroller();
const router = express.Router();

router.post(
  '/signup',
  [validateUser, checkForRepetitiveUser],
  userController.signUp.bind(userController),
);

module.exports = router;
