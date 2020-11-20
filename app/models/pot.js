const mongoose = require('mongoose')
const Schema = mongoose.Schema

const potSchema = new Schema({
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }}, {
  timestamps: true
})

module.exports = mongoose.model('Pot', potSchema)
