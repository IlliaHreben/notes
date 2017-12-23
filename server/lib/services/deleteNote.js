const ServiceError = require('../ServiceError')
const {ObjectID} = require('mongodb')
const connect = require('../model')

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

module.exports = deleteNote
