const express = require('express');

const validateData = require('../middlewares/validateData');
const checkAccess = require('../middlewares/checkAccess');

const CalendarCotroller = require('../controllers/Calendar');
const calendarSchema = require('../schemas/calendar'); 
const calendarCotroller = new CalendarCotroller();
const router = express.Router();

router.get(
  '/month',
  [checkAccess(true)], 
  calendarCotroller.getMonthActivities.bind(calendarCotroller),
);
router.get(
  '/day',
  [checkAccess(true)], 
  calendarCotroller.getDayActivities.bind(calendarCotroller),
);

module.exports = router;
