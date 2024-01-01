const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

class Database {
  constructor (Model) {
    this.Model = Model;
  }
 
  static async connect () {
    const host = process.env.DB_HOST;
    const dbName = process.env.DB_NAME;
    const uri = 'mongodb://' + host + ':27017/' + dbName;
    // try {
      await mongoose.connect(uri);
      console.log('connected to DB');
    // } catch (err) {
    //   console.log(err);
    // }
  }
  
  async create (data) {
    const model = new this.Model(data);
    return await model.save();
  }
  
  async update (id) {
    return await this.Model.findOneAndUpdate(id);
  }
  
  async get (id) {
    return await this.Model.findById(id);
  }
}

module.exports = Database;