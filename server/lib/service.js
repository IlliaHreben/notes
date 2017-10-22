const {MongoClient, ObjectID} = require('mongodb')

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
      notes.findOne({userId})
        .then(note => {
          if (note) {
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
      return notes.findOne({userId, _id: new ObjectID(id)})
        .then(note => {
          if (note) {
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
  .then((user) => undefined)

const authUser = ({email, password}) => connect
  .then(db => {
    const users = db.collection('users')
    return users.findOne({email})
  })
  .then(user => {
    if (user.password === password) {
      return {userId: user._id}
    }
    throw new Error('user wasn\'t found in database')
  })

function checkUser (userId) {
  return connect.then(db => {
    const users = db.collection('users')
    return users.findOne({_id: new ObjectID(userId)})
  })
  .then(user => {
    if (user) {
      return user
    }
    throw new Error('Invalid user id')
  })
}

module.exports = {createNote, getNotes, deleteNote, editNote, createUser, authUser, checkUser}
