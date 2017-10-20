const {MongoClient, ObjectID} = require('mongodb')

const url = 'mongodb://localhost:27017/network'
const connect = MongoClient.connect(url)

const createNote = (note) => connect
  .then(db => {
    const notes = db.collection('notes')
    return isValidPass(note.email, note.password)
      .then(() => {
        return notes.insert({
          email: note.email,
          text: note.text,
          updatedAt: new Date()
        })
      })
  })
  .then(result => ({
    id: result.insertedIds[0],
    updatedAt: result.ops[0].updatedAt
  }))

const getNotes = ({order, email, password}) => {
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return isValidPass(email, password)
        .then(() => notes.find({email}).sort({updatedAt: order}).toArray())
    })
    .then(notes => notes.map(note => ({
      id: note._id,
      text: note.text,
      updatedAt: note.updatedAt
    })))
}

const deleteNote = (note) => {
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return isValidPass(note.email, note.password)
        .then(() => notes.deleteOne({_id: new ObjectID(note.id)}))
    })
    .then(() => undefined)
}

const editNote = (note) => {
  const updatedAt = new Date()
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return isValidPass(note.email, note.password)
        .then(() => notes.update(
          {_id: new ObjectID(note.id)},
          {'$set': {text: note.text, updatedAt}}
        ))
    })
    .then(() => ({
      id: note.id,
      text: note.text,
      updatedAt
    }))
}

const createUser = (regData) => connect
  .then(db => {
    const users = db.collection('users')
    return users.findOne({email: regData.email})
      .then(user => {
        if (user) {
          throw new Error('email was found in database')
        }
        return users.insert({email: regData.email, password: regData.password})
      })
  })
  .then(() => undefined)

const authUser = (authData) => connect
  .then(db => {
    const users = db.collection('users')
    return users.find({email: authData.email}).toArray()
      .then(user => {
        if (authData.password === user.password) {
          return {ok: true}
        }
        return undefined
      })
  })

function isValidPass (email, pass) {
  return connect.then(db => {
    const users = db.collection('users')
    return users.findOne({email})
  })
    .then(user => {
      if (user.password !== pass) {
        throw new Error('password is not correctly')
      }
      return {ok: true}
    })
}

module.exports = {createNote, getNotes, deleteNote, editNote, createUser, authUser}
