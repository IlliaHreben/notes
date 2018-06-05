const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: String,
  profilePicture: Buffer,
  created: {
    type: Date,
    default: Date.now
  }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel
