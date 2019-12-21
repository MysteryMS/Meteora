const mongoose = require('mongoose')

const guilds = new mongoose.Schema({
  _id: String,
  name: String,
  language: String,
  prefix: String,
  playlist: Map
})

module.exports = mongoose.model('guilds', guilds)
