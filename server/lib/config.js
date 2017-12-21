function getMongoUri () {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI
  }

  const host = process.env.MONGO_HOST || 'localhost'
  const port = process.env.MONGO_PORT || '27017'
  const dbName = process.env.MONGO_DB_NAME || 'notes'
  return `mongodb://${host}:${port}/${dbName}`
}

const mongoUri = getMongoUri()

const port = process.env.PORT || '3000'

const domain = process.env.DOMAIN || `http://localhost:${port}`

module.exports = {mongoUri, domain, port}
