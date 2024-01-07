const mongoose = require('mongoose');

const ActivityTypeSchema = new mongoose.Schema({
  title: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
}); 
const ActivityTypeModel = mongoose.model('ActivityType', ActivityTypeSchema);

module.exports = ActivityTypeModel;
