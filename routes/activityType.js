const express = require('express');

const validateData = require('../middlewares/validateData');
const checkAccess = require('../middlewares/checkAccess');
const checkForRepetitive = require('../middlewares/checkForRepetitive');

const ActivityTypeCotroller = require('../controllers/ActivityType');
const activityTypeSchema = require('../schemas/activityType');
const ActivityTypeModel = require('../models/ActivityType');
const AcTyResponses = require('../responses/activityType.json');

const activityTypeCotroller = new ActivityTypeCotroller();
const router = express.Router();

router.post(
  '/',
  [checkAccess(true), validateData(activityTypeSchema.add, ['body']), checkForRepetitive(ActivityTypeModel, ['title', 'userId'], AcTyResponses)],
  activityTypeCotroller.add.bind(activityTypeCotroller),
);
router.put(
  '/',
  [checkAccess(true), validateData(activityTypeSchema.update, ['body', 'query']), checkForRepetitive(ActivityTypeModel, ['title', 'userId'], AcTyResponses)],
  activityTypeCotroller.update.bind(activityTypeCotroller),
);
router.get(
  '/',
  [checkAccess(true)],
  activityTypeCotroller.showAll.bind(activityTypeCotroller),
);

module.exports = router;
