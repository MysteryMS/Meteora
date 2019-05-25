const mongoose = require('mongoose')

const guilds = new mongoose.Schema({
  _id: String,
  name: String,
  counterOn: Boolean,
  counterChannel: String,
  counterMessage: String,
  wMessageOn: Boolean,
  wMessageMessage: String,
  wMessageChannel: String,
  leaveMessage: Boolean,
  leaveMessageMessage: String,
  leaveMessageChannel: String,
  language: String
})

module.exports = mongoose.model('guilds', guilds)
