const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  password: {type: String, required: true},
}); 
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
