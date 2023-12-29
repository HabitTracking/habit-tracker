const express = require('express');
const validateUser = require('../middlewares/validateUser');
const UserCotroller = require('../controllers/User');

const userController = new UserCotroller();
const router = express.Router();

router.post('/signup', validateUser, userController.signUp.bind(userController));

module.exports = router;
