const ServiceError = require('../ServiceError')
const {secret} = require('../config')
const {ObjectID} = require('mongodb')
const connect = require('../model')
const jwt = require('jwt-simple')

function checkUserId (token) {
  return connect.then(db => {
    const users = db.collection('users')
    return users.findOne({_id: new ObjectID(jwt.decode(token, secret).userId)})
  })
    .then(user => {
      if (user) {
        return user
      }
      throw new ServiceError('Invalid user id.', 'WRONG_ID')
    })
}

module.exports = checkUserId
