const {mongoUri} = require('./config')
const {MongoClient} = require('mongodb')
const connect = MongoClient.connect(mongoUri).then(db => db)

module.exports = connect
