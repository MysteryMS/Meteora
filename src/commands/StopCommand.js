const Command = require('../structures/Command')

class StopCommand extends Command {
  constructor () {
    super('stop')
    this.category = 'music'
    this.name = 'Stop'
    this.aliases = ['parar']
  }

  async run (message, args, server, { t }) {
    if (!this.client.lavalinkManager.manager.players.has(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    this.client.player.get(message.guild.id).player.stop()
    message.channel.send(t('commands:music.stop'))
  }
}

module.exports = StopCommand
