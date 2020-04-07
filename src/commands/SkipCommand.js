const Command = require('../structures/Command')

class SkipCommand extends Command {
  constructor () {
    super('skip')
    this.name = 'Skip'
    this.description = 'Pula uma música'
    this.category = 'music'
  }

  async run (message, args, server, { t }) {
    if (!this.client.lavalinkManager.manager.players.has(message.guild.id)) {
      return message.reply(t('commands:music.notPlaying'))
    }
    if (this.client.player.get(message.guild.id).repeat) {
      this.client.player.get(message.guild.id).repeat = false
      this.client.player.get(message.guild.id).repeatTrack = ''
    }

    if (this.client.player.get(message.guild.id).queue.length === 0) {
      this.client.player.get(message.guild.id).nowPlaying = ''
      message.channel.send(t('commands:music.skipped')).then(() => this.client.player.get(message.guild.id).player.stop())
    } else {
      message.channel.send(t('commands:music.skipped')).then(() => this.client.player.get(message.guild.id).skip())
    }
  }
}

module.exports = SkipCommand
