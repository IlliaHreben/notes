const ServiceError = require('../ServiceError')
const {ObjectID} = require('mongodb')

const editNote = ({id, theme, text, userId}, connect) => {
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
        .then(() => notes.updateOne(
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

module.exports = editNote
