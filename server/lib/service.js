const {MongoClient, ObjectID} = require('mongodb')

const url = 'mongodb://localhost:27017/network'
const connect = MongoClient.connect(url)


const createNote = (note) => {
  return connect
  .then(db => {
    const notes = db.collection('notes')
    return notes.insert(note)
  })
  .then(result => ({id: result.insertedIds[0]}))
}

const getNotes = () => {
  return connect
  .then(db => {
    const notes = db.collection('notes')
    return notes.find({}).toArray()
  })
  .then(notes => notes.map(note => ({
    id: note._id,
    text: note.text
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
  return connect
  .then(db => {
    const notes = db.collection('notes')
    return notes.update({_id: new ObjectID(note.id)} , {'$set':{text: note.text}})
  })
}


module.exports = {createNote, getNotes, deleteNote, editNote}
