const createNote = ({theme, text, userId}, {db, connectMongoose}) => db
  .then(({notes}) => {
    connectMongoose.then(() => {
      const newNote = new noteModel ({
        _id: new mongoose.Types.ObjectId(),
        userId,
        theme,
        text,
        updatedAt: new Date()
      })
    })
    return newNote.save()
  })
  .then(result => ({
    id: result.insertedIds[0],
    updatedAt: result.ops[0].updatedAt
  }))

module.exports = createNote


    return notes.insert({
  userId,
  theme,
  text,
  updatedAt: new Date()
})
