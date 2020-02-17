const {mongoUri} = require('./config')
const {MongoClient} = require('mongodb')
const db = MongoClient.connect(mongoUri)
  .then(db => {
    return {
      notes: db.collection('notes'),
      users: db.collection('users')
    }
  })

var mongoose = require('mongoose')
const connectMongoose = mongoose.connect('mongodb://localhost/mongoose_basics')

module.exports = {db, connectMongoose}
