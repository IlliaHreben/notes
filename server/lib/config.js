const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes'

const port = process.env.PORT || '3000'

const domain = process.env.DOMAIN || `http://localhost:${port}`

const emailFrom = process.env.EMAIL_FROM

const secret = process.env.SECRET

const emailApiKey = process.env.MAILGUN_API_KEY
const emailDomain = process.env.MAILGUN_DOMAIN

module.exports = {mongoUri, domain, port, emailFrom, secret, emailApiKey, emailDomain}
