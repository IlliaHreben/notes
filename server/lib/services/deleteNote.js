const ServiceError = require('../ServiceError')
const {ObjectID} = require('mongodb')

const deleteNote = ({id, text, userId}, connect) => connect
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

module.exports = deleteNote
