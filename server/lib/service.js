const ServiceError = require('./ServiceError')
const {MongoClient, ObjectID} = require('mongodb')

const jwt = require('jwt-simple')
const secret = 'aaa'

const bcrypt = require('bcryptjs')
const saltRounds = 10

function getMongoUri () {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI
  }

  const host = process.env.MONGO_HOST || 'localhost'
  const port = process.env.MONGO_PORT || '27017'
  const dbName = process.env.MONGO_DB_NAME || 'notes'
  return `mongodb://${host}:${port}/${dbName}`
}

const connect = MongoClient.connect(getMongoUri())

const isValidEmail = require('is-valid-email')

const createNote = ({text, userId}) => connect
  .then(db => {
    const notes = db.collection('notes')
    return notes.insert({
      userId,
      text,
      updatedAt: new Date()
    })
  })
  .then(result => ({
    id: result.insertedIds[0],
    updatedAt: result.ops[0].updatedAt
  }))

const getNotes = ({order, userId}) => {
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.find({userId}).sort({updatedAt: order}).toArray()
    })
    .then(notes => notes.map(note => ({
      id: note._id,
      text: note.text,
      updatedAt: note.updatedAt
    })))
}

const deleteNote = ({id, text, userId}) => {
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.findOne({_id: new ObjectID(id)})
        .then(note => {
          if (note.userId.equals(userId)) {
            return
          }
          throw new ServiceError('cannot delete note', 'WRONG_ID')
        })
        .then(() => notes.deleteOne({_id: new ObjectID(id)}))
    })
    .then(() => undefined)
}

const editNote = ({id, text, userId}) => {
  const updatedAt = new Date()
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.findOne({_id: new ObjectID(id)})
        .then(note => {
          if (note.userId.equals(userId)) {
            return
          }
          throw new ServiceError('cannot edit note', 'WRONG_ID')
        })
        .then(() => notes.update(
          {_id: new ObjectID(id)},
          {'$set': {text, updatedAt}}
        ))
    })
    .then(() => ({
      id,
      text,
      updatedAt
    }))
}

const createUser = (regData) => {
  return Promise.resolve()
    .then(() => isEmailValid(regData.email))
    .then(() => connect)
    .then(db => {
      const users = db.collection('users')
      return users.findOne({email: regData.email})
        .then(user => {
          if (user) {
            throw new ServiceError('a user with this email already exists', 'NOT_UNIQUE')
          }
          return bcrypt.hash(regData.password, saltRounds)
        })
        .then(hash => {
          users.insert({email: regData.email, password: hash})
        })
    })
    .then(() => undefined)
}

function isEmailValid (email) {
  if (!isValidEmail(email)) {
    throw new ServiceError('invalid email: (@xxx.xx)', 'INVALID_EMAIL')
  }
}

const authUser = ({email, password}) => connect
  .then(db => {
    const users = db.collection('users')
    return users.findOne({email})
  })
  .then(user => {
    if (!user) {
      throw new ServiceError('email was not found', 'WRONG_EMAIL')
    }
    return bcrypt.compare(password, user.password).then(res => {
      if (!res) {
        throw new ServiceError('wrong password', 'WRONG_PASS')
      }
      return {token: jwt.encode({userId: user._id}, secret)}
    })
  })

const dellAllNotes = ({userId}) => {
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.remove({userId})
    })
    .then(() => undefined)
}

function checkUser (token) {
  return connect.then(db => {
    const users = db.collection('users')
    return users.findOne({_id: new ObjectID(jwt.decode(token, secret).userId)})
  })
    .then(user => {
      if (user) {
        return user
      }
      throw new ServiceError('invalid user id', 'WRONG_ID')
    })
}

module.exports = {createNote, getNotes, deleteNote, editNote, createUser, authUser, checkUser, dellAllNotes}
