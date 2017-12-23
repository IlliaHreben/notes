const ServiceError = require('../ServiceError')
const {secret, domain, emailFrom, emailApiKey, emailDomain} = require('../config')
const connect = require('../model')
const bcrypt = require('bcryptjs')
const saltRounds = 10
const jwt = require('jwt-simple')
const {promisify} = require('util')
const isValidEmail = require('is-valid-email')

const mailgun = require('nodemailer-mailgun-transport')
const nodemailer = require('nodemailer')
// const stubTransport = require('nodemailer-stub-transport')
// const transport = nodemailer.createTransport(stubTransport())
// const transportSendMail = promisify(transport.sendMail.bind(transport))

const auth = {
  auth: {
    api_key: emailApiKey,
    domain: emailDomain
  }
}

const transport = nodemailer.createTransport(mailgun(auth))
const transportSendMail = promisify(transport.sendMail.bind(transport))

const createUser = (regData) => {
  return Promise.resolve()
    .then(() => isEmailValid(regData.email))
    .then(() => connect)
    .then(db => {
      const users = db.collection('users')
      return users.findOne({email: regData.email})
        .then(user => {
          if (user) {
            throw new ServiceError('A user with this email already exists.', 'NOT_UNIQUE')
          }
          return bcrypt.hash(regData.password, saltRounds)
        })
        .then(hash => users.insert({email: regData.email, password: hash, status: 'PENDING'}))
    })
    .then(user => {
      const token = jwt.encode({userId: user.ops[0]._id}, secret)
      const registrationLink = domain + `/api/registration/confirm/?authorization=${token}`
      return transportSendMail({
        from: emailFrom,
        to: regData.email,
        subject: 'Please confirm your registration',
        text: `Hello. In order to complete your registration, you must confirm your email.
               Please follow the links below: ${registrationLink}`
      })
    })
    .then(info => console.log('Response:', info))
}

function isEmailValid (email) {
  if (!isValidEmail(email)) {
    throw new ServiceError('invalid email: (@xxx.xx)', 'INVALID_EMAIL')
  }
}

module.exports = createUser
