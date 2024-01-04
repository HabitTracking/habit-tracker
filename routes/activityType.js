const express = require('express');

const validateData = require('../middlewares/validateData');
const checkAccess = require('../middlewares/checkAccess');
const hashProperty = require('../middlewares/hashProperty');
const checkForRepetitive = require('../middlewares/checkForRepetitive');

const ActivityTypeCotroller = require('../controllers/ActivityType');
const activityTypeSchema = require('../schemas/activityType');
const ActivityTypeModel = require('../models/ActivityType');
const AcTyResponses = require('../responses/activityTypeResponses.json');

const activityTypeCotroller = new ActivityTypeCotroller();
const router = express.Router();

router.post(
  '/',
  [checkAccess(true), validateData(activityTypeSchema.add), checkForRepetitive(ActivityTypeModel, 'title', AcTyResponses)],
  activityTypeCotroller.add.bind(activityTypeCotroller),
);
router.get(
  '/:id',
  [checkAccess(true)],
  activityTypeCotroller.show.bind(activityTypeCotroller),
);

module.exports = router;
