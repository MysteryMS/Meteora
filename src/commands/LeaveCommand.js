const Command = require('../structures/Command')

class LeaveCommand extends Command {
  constructor () {
    super('leave')
    this.category = 'Música'
    this.name = 'Leave'
    this.aliases = ['sair', 'quit']
  }

  async run (message, args, server, { t }) {
    if (!this.client.lavalinkManager.manager.players.has(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    this.client.lavalinkManager.manager.leave(message.guild.id)
    this.client.lavalinkManager.manager.delete(message.guild.id)
    message.channel.send(t('commands:music.leave', { channel: message.guild.member(this.client.user).voiceChannel.name }))
  }
}

module.exports = LeaveCommand
