const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  date: {type: String, required: true},
  activities: {type: [String]},
}); 
const CalendarModel = mongoose.model('Calendar', CalendarSchema);

module.exports = CalendarModel;
