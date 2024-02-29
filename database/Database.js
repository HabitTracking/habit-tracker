const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../startup/logger');

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
    logger.info('connected to DB');
    // } catch (err) {
    //   logger.error('can not connect to DB', err);
    //   process.exit();
    // }
  }
  
  async create (data) {
    const model = new this.Model(data);
    return await model.save();
  }
  async updateById (_id, updateObj) {
    return await this.Model.updateOne({_id}, updateObj);
  }
  async updateByField (fieldName, fieldValue, updateObj) {
    return await this.Model.updateOne({[fieldName]: fieldValue}, updateObj);
  }
  async getById (id) {
    let document;
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      document = await this.Model.findById(id);
    } else {
      document = await this.Model.find({});
    }
    if (!document) return null;
    return document._doc;
  }
  async getByField (field, value) {
    const data = await this.Model.find({[field]: value});
    return data ? data.map(value => value._doc) : null;
  }
  async getInSpan (field, gte, lt) {
    const condition = {[field]: {$gte: gte, $lt: lt}};
    const data = await this.Model.find(condition);
    return data ? data.map(value => value._doc) : null;
  }
  async conditionalGet (condition) {
    const data = await this.Model.find(condition);
    return data ? data.map(value => value._doc) : null;
  }
}

module.exports = Database;