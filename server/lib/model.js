const {mongoUri} = require('./config')
const {MongoClient} = require('mongodb')
const connect = MongoClient.connect(mongoUri)

module.exports = connect
