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
    this.client.lavalinkManager.manager.players.get(message.guild.id).destroy()
    const localManager = this.client.player.get(message.guild.id)
    localManager.repeatTrack = ''
    localManager.repeat = false
    localManager.queue[0] = undefined
    message.channel.send(t('commands:music.stop'))
  }
}

module.exports = StopCommand
