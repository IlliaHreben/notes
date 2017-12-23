const connect = require('../model')

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

module.exports = getNotes
