const ServiceError = require('../ServiceError')
const {secret} = require('../config')
const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')

const authUser = ({email, password}, connect) => connect
  .then(db => {
    const users = db.collection('users')
    return users.findOne({email})
  })
  .then(user => {
    if (!user) {
      throw new ServiceError('Email was not found.', 'WRONG_EMAIL')
    } else if (user.status === 'PENDING') {
      throw new ServiceError('Account was not confirmed.', 'UNCONFIRMED_ACCOUNT')
    }
    return bcrypt.compare(password, user.password).then(res => {
      if (!res) {
        throw new ServiceError('Wrong password.', 'WRONG_PASS')
      }
      return {token: jwt.encode({userId: user._id}, secret)}
    })
  })

module.exports = authUser
