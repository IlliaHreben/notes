const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: String,
    required: true
  },
  theme: String,
  text: String,
  updatedAt: Date
})

const noteModel = mongoose.model('note', noteSchema)

module.exports = noteModel
