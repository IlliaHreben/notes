const createNote = ({theme, text, userId}, connect) => connect
  .then(db => {
    const notes = db.collection('notes')
    return notes.insert({
      userId,
      theme,
      text,
      updatedAt: new Date()
    })
  })
  .then(result => ({
    id: result.insertedIds[0],
    updatedAt: result.ops[0].updatedAt
  }))

module.exports = createNote
