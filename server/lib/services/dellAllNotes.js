const dellAllNotes = ({userId}, connect) => {
  return connect
    .then(db => {
      const notes = db.collection('notes')
      return notes.remove({userId})
    })
    .then(() => undefined)
}

module.exports = dellAllNotes
