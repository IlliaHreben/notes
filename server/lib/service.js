const {MongoClient, ObjectID} = require('mongodb')

const jwt = require('jwt-simple')
const secret = 'aaa'

const bcrypt = require('bcrypt')
const saltRounds = 10

const url = 'mongodb://localhost:27017/network'
const connect = MongoClient.connect(url)

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
          throw new Error('wrong request')
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
          throw new Error('wrong request')
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
  return isEmailValid(regData.email).then(() => connect)
    .then(db => {
      const users = db.collection('users')
      return users.findOne({email: regData.email})
        .then(user => {
          if (user) {
            throw new Error('a user with this email already exists')
          }
          return bcrypt.hash(regData.password, saltRounds)
        })
        .then(hash => users.insert({email: regData.email, password: hash}))
    })
    .then(() => undefined)
}

function isEmailValid (email) {
  const validEmails = '@ukr.net, @mail.ru, @gmail.com'
  const isDomainOk = new RegExp(email).test(validEmails)
  if (!isDomainOk) {
    return Promise.reject(new Error('invalid email: (@xxx.xx)'))
  }
  return Promise.resolve({ok: true})
}

const authUser = ({email, password}) => connect
  .then(db => {
    const users = db.collection('users')
    return users.findOne({email})
  })
  .then(user => {
    if (!user) {
      throw new Error('wrong email')
    }
    return bcrypt.compare(password, user.password).then(res => {
      if (!res) {
        throw new Error('wrong password')
      }
      return {token: jwt.encode({userId: user._id}, secret)}
    })
  })

function checkUser (token) {
  return connect.then(db => {
    const users = db.collection('users')
    return users.findOne({_id: new ObjectID(jwt.decode(token, secret).userId)})
  })
    .then(user => {
      if (user) {
        return user
      }
      throw new Error('invalid user id')
    })
}

module.exports = {createNote, getNotes, deleteNote, editNote, createUser, authUser, checkUser}
