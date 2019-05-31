const EventListener = require('../structures/EventListener')
const Guild = require('../../models/guild')

class GuildCreateListener extends EventListener {
  constructor () {
    super('guildCreate')
  }

  async run (guild) {
    Guild.findOne({ _id: guild.id }, function (err, database) {
      if (!database) {
        new Guild({
          _id: guild.id,
          name: guild.name,
          counterOn: false,
          counterChannel: null,
          counterMessage: null,
          wMessage: false,
          wMessageMessage: null,
          wMessageChannel: null,
          leaveMessage: false,
          leaveMessageMessage: null,
          leaveMessageChannel: null,
          language: guild.region === 'brazil' ? 'pt-BR' : 'en-us',
          prefix: 'r>>'
        }).save()
      }
      if (err) return console.log(err)
    })
  }
}

module.exports = GuildCreateListener
