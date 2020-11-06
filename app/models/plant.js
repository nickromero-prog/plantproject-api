const mongoose = require('mongoose')
const Schema = mongoose.Schema

const plantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  light: {
    type: String,
    required: true
  },
  water: {
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

module.exports = mongoose.model('Plant', plantSchema)
