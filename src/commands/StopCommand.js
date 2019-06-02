const Command = require('../structures/Command')

class StopCommand extends Command {
  constructor () {
    super('stop')
    this.category = 'Música'
    this.name = 'Stop'
    this.aliases = ['parar']
  }
  async run (message, args, { t }) {
    if (!this.client.lavalinkManager.manager.has(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    this.client.calls.get(message.guild.id).player.stop()
    message.channel.send(t('commands:music.stop'))
  }
}