const mongoose = require('mongoose');

const ActivityTypeSchema = new mongoose.Schema({
  title: {type: String, unique: true, required: true},
}); 
const ActivityTypeModel = mongoose.model('ActivityType', ActivityTypeSchema);

module.exports = ActivityTypeModel;
