const Command = require('../structures/Command')

class BassBoostCommand extends Command {
  constructor() {
    super('bassboost', ['bb'])
    this.category = 'music'
    this.beta = true
  }
  async run (message, args, server, { t }) {
    const player = this.client.player.get(message.guild.id)
    if (player.bb) {
      player.bassboost(true)
      message.channel.send(t('commands:bassboost.enabling'))
    } else {
      player.bassboost(false)
      message.channel.send(t('commands:bassboost.disabling'))
    }
  }
}

module.exports = BassBoostCommand