const express = require('express');

const validateData = require('../middlewares/validateData');
const checkAccess = require('../middlewares/checkAccess');

const ActivityController = require('../controllers/Activity');
const activitySchema = require('../schemas/activity');

const activityController = new ActivityController();
const router = express.Router();

router.post(
  '/',
  [checkAccess(true), validateData(activitySchema.add)],
  activityController.add.bind(activityController),
);
router.get(
  '/',
  [checkAccess(true)],
  activityController.getAll.bind(activityController),
);
router.post(
  '/addProgress',
  [checkAccess(true), validateData(activitySchema.progress)],
  activityController.addProgress.bind(activityController),
);

module.exports = router;
