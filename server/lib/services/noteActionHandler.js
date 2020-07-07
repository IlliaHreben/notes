// const ServiceError = require('../ServiceError')
// const {ObjectID} = require('mongodb')
//
// const deleteNote = (noteData, connect) => connect
//   .then(db => db.collection('notes'))
//
//   OR
//
//   const deleteNote = (noteData, connect) => connect
//     .then(db => {
//       const notes = db.collection('notes')
//       return notes.findOne({_id: new ObjectID(id)})
//         .then(note => {
//           if (note.userId.equals(userId)) {
//             return
//           }
//           throw new ServiceError('Cannot delete note.', 'WRONG_ID')
//         })
//
//
//
//
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
//
//
//     const editNote = ({id, theme, text, userId}, connect) => {
//       const updatedAt = new Date()
//       return connect
//         .then(db => {
//           const notes = db.collection('notes')
//           return notes.findOne({_id: new ObjectID(id)})
//             .then(note => {
//               if (note.userId.equals(userId)) {
//                 return
//               }
//               throw new ServiceError('Cannot edit note.', 'WRONG_ID')
//             })
//             .then(() => notes.updateOne(
//               {_id: new ObjectID(id)},
//               {'$set': {theme, text, updatedAt}}
//             ))
//         })
//         .then(() => ({
//           id,
//           theme,
//           text,
//           updatedAt
//         }))
//     }
//
//     module.exports = editNote
