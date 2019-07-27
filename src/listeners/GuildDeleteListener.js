const EventListener = require('../structures/EventListener')
const Guild = require('../../models/guild')

class GuildRemoveListener extends EventListener {
  constructor () {
    super('guildDelete')
  }
  async run (guild) {
    Guild.findOneAndDelete({ _id: guild.id }, (error, database) => {
      if (error) this.error(error)
      console.log('Removido ' + guild.name + ' da database')
    })
  }
}

module.exports = GuildRemoveListener
