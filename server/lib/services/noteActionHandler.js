// const ServiceError = require('../ServiceError')
// const {ObjectID} = require('mongodb')
//
// const deleteNote = (noteData, connect) => connect
//   .then(db => {
//     const notes = db.collection('notes')
//     return notes.findOne({_id: new ObjectID(id)})
//       .then(note => {
//         if (note.userId.equals(userId)) {
//           return
//         }
//         throw new ServiceError('Cannot delete note.', 'WRONG_ID')
//       })
//       .then(() => notes.deleteOne({_id: new ObjectID(id)}))
//   })
//   .then(() => undefined)
// 
//   const createNote = ({theme, text, userId}, connect) => connect
//     .then(db => {
//       const notes = db.collection('notes')
//       return notes.insert({
//         userId,
//         theme,
//         text,
//         updatedAt: new Date()
//       })
//     })
//     .then(result => ({
//       id: result.insertedIds[0],
//       updatedAt: result.ops[0].updatedAt
//     }))
