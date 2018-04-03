const ServiceError = require('../ServiceError')
const {secret, domain, emailFrom, emailApiKey, emailDomain} = require('../config')
const connect = require('../model')
const bcrypt = require('bcryptjs')
const saltRounds = 10
const jwt = require('jwt-simple')
const {promisify} = require('util')
const isValidEmail = require('is-valid-email')
const gravatar = require('gravatar-api')

const mailgun = require('nodemailer-mailgun-transport')
const nodemailer = require('nodemailer')

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
        .then(hash => users.insert({
          email: regData.email,
          password: hash,
          gravatarUrl: gravatar.imageUrl({
            email: regData.email,
            parameters: {'size': '100'}
          }),
          status: 'PENDING'
        }))
    })
    .then(user => {
      const token = jwt.encode({userId: user.ops[0]._id}, secret)
      const registrationLink = domain + `/api/registration/confirm/?authorization=${token}`
      return transportSendMail({
        from: emailFrom,
        to: regData.email,
        subject: 'Please confirm your registration',
        html: `<!DOCTYPE html><html lang="ru"><head> <meta charset="UTF-8"> <title>Title</title></head><body style="font-family: 'vladivostokRegular', Tahoma; margin: 0px auto; background-image: url(${domain}/pictures/bg.png);"><div class="supernotes" style="font-family: 'VladivostokBold', Tahoma; margin: 10px auto; margin-top: 10%; padding: 15px; cursor: default;"><p class="super" style="font-family: 'VladivostokBold', Tahoma; font-size: 75px; color: rgb(71, 71, 71); margin: auto; width: 555px;"><img src="${domain}/pictures/icon.png" class="icon" style="color: rgb(71, 71, 71); width: 62px; height: 62px; margin-top: 5px;">SUPER<span class="notes" style="color: rgb(84, 107, 122); font-family: 'VladivostokRegular', Tahoma;">NOTES</span></p></div><div class="mailText" style="font-variant: small-caps; margin: auto; text-align: center; cursor: default;"><p>We are glad that you have chosen our project and sincerely hope that you will like it.</p><p>To complete the registration you need to click on the <a href="${registrationLink}" style="position: relative; color: #000; text-decoration: none; font-size: 18px; display: inline-block;">link</a>.</p></div></body></html>`
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
