const ServiceError = require('./ServiceError')
const {MongoClient, ObjectID} = require('mongodb')

const config = require('./config')

const jwt = require('jwt-simple')
const secret = 'aaa'

const bcrypt = require('bcryptjs')
const saltRounds = 10

const isValidEmail = require('is-valid-email')

const connect = MongoClient.connect(config.mongoUri)

const createNote = ({theme, text, userId}) => connect
  .then(db => {
    const notes = db.collection('notes')
    return notes.insert({
      userId,
      theme,
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
      theme: note.theme,
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
          throw new ServiceError('Cannot delete note.', 'WRONG_ID')
        })
        .then(() => notes.deleteOne({_id: new ObjectID(id)}))
    })
    .then(() => undefined)
}

const editNote = ({id, theme, text, userId}) => {
  const updatedAt = new Date()
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.findOne({_id: new ObjectID(id)})
        .then(note => {
          if (note.userId.equals(userId)) {
            return
          }
          throw new ServiceError('Cannot edit note.', 'WRONG_ID')
        })
        .then(() => notes.update(
          {_id: new ObjectID(id)},
          {'$set': {theme, text, updatedAt}}
        ))
    })
    .then(() => ({
      id,
      theme,
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
            throw new ServiceError('A user with this email already exists.', 'NOT_UNIQUE')
          }
          return bcrypt.hash(regData.password, saltRounds)
        })
        .then(hash => users.insert({email: regData.email, password: hash, status: 'PENDING'}))
    })
    .then(user => {
      const token = jwt.encode({userId: user.ops[0]._id}, secret)
      const registrationLink = config.domain + `/api/registration/confirm/?authorization=${token}`
      console.log(registrationLink)
    })
}

const confirmUser = ({user}) => {
  return connect
    .then(db => {
      const users = db.collection('users')
      return users.update(
        {_id: user._id},
        {'$set': {status: 'ACTIVE'}}
      )
    })
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
      throw new ServiceError('Invalid user id.', 'WRONG_ID')
    })
}

module.exports = {createNote, getNotes, deleteNote, editNote, createUser, authUser, checkUser, dellAllNotes, confirmUser}
