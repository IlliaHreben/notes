const connect = require('../model')
const ServiceError = require('../ServiceError')

const getAvatar = ({userId}) => {
  return connect
    .then(db => {
      const users = db.collection('users')
      return users.findOne({userId})
    })
    .then(user => {
      if (user) {
        return user.gravatarUrl
      }
      throw new ServiceError('Avatar is not found.', 'AVATAR_NOT_FOUND')
    })
}

module.exports = getAvatar
