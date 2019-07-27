const EventListener = require('../structures/EventListener')
const Guild = require('../../models/guild')

class GuildRemoveListener extends EventListener {
  constructor () {
    super('guildDelete')
  }
  async run (guild) {
    Guild.findOneAndDelete({ _id: guild.id })
  }
}

module.exports = GuildRemoveListener
