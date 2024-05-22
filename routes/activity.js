const express = require('express');

const validateData = require('../middlewares/validateData');
const checkAccess = require('../middlewares/checkAccess');

const ActivityController = require('../controllers/Activity');
const activitySchema = require('../schemas/activity');

const activityController = new ActivityController();
const router = express.Router();

router.post(
  '/',
  [checkAccess(true), validateData(activitySchema.add, ['body'])],
  activityController.add.bind(activityController),
);
router.put(
  '/',
  [checkAccess(true), validateData(activitySchema.update, ['body', 'query'])],
  activityController.update.bind(activityController),
);
router.get(
  '/',
  [checkAccess(true)],
  activityController.getAll.bind(activityController),
);
router.delete(
  '/',
  [checkAccess(true), validateData(activitySchema.remove, ['query'])],
  activityController.remove.bind(activityController),
);
router.post(
  '/addProgress',
  [checkAccess(true), validateData(activitySchema.progress, ['body'])],
  activityController.addProgress.bind(activityController),
);

module.exports = router;
