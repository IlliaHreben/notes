const {MongoClient, ObjectID} = require('mongodb')

const url = 'mongodb://localhost:27017/network'
const connect = MongoClient.connect(url)

const createNote = (note) => connect
  .then(db => {
    const notes = db.collection('notes')
    return notes.insert({text: note.text, updatedAt: new Date()})
  })
  .then(result => ({
    id: result.insertedIds[0],
    updatedAt: result.ops[0].updatedAt
  }))

const getNotes = ({order}) => {
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.find({}).sort({updatedAt: order}).toArray()
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
      return notes.deleteOne({_id: new ObjectID(note.id)})
    })
}

const editNote = (note) => {
  const updatedAt = new Date()
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.update({_id: new ObjectID(note.id)}, {'$set': {text: note.text, updatedAt}})
    })
    .then(() => ({
      id: note.id,
      text: note.text,
      updatedAt
    }))
}

module.exports = {createNote, getNotes, deleteNote, editNote}
