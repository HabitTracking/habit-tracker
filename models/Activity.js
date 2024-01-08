const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  name: {type: String, required: true},
  note: {type: String},
  color: {type: String},
  activityType: {type: String, required: true},
  startTime: {type: String, required: true},
  frequency: {type: Number, required: true},
  dueDate: {type: String, required: true},
  targetUnit: {type: String, required: true},
  targetAmount: {type: Number, required: true},
  progress: {type: Object, required: true},
}); 
const ActivityTypeModel = mongoose.model('Activity', ActivitySchema);

module.exports = ActivityTypeModel;
