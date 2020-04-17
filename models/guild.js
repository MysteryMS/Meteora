const mongoose = require('mongoose')

const guilds = new mongoose.Schema({
  _id: String,
  name: String,
  language: String,
  prefix: String,
  playlist: Map,
  djRole: String
})

module.exports = mongoose.model('guilds', guilds)
