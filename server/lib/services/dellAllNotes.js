const connect = require('../model')

const dellAllNotes = ({userId}) => {
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.remove({userId})
    })
    .then(() => undefined)
}

module.exports = dellAllNotes
