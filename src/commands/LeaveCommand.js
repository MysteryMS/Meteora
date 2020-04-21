const Command = require('../structures/Command')

class LeaveCommand extends Command {
  constructor () {
    super('leave')
    this.category = 'Música'
    this.name = 'Leave'
    this.aliases = ['sair', 'quit', 'disconnect', 'dc']
    this.category = 'music'
  }

  async run (message, args, server, { t }) {
    if (!message.guild.me.voice.channel) return message.reply(t('commands:music.notPlaying'))
    await this.client.lavalinkManager.manager.leave(message.guild.id)
    this.client.lavalinkManager.manager.players.delete(message.guild.id)
    this.client.player.delete(message.guild.id)
    this.client.lavalinkManager.manager.voiceServers.delete(message.guild.id)
    message.channel.send(t('commands:music.leave', { channel: message.guild.member(this.client.user).voice.channel.name }))
  }
}

module.exports = LeaveCommand
