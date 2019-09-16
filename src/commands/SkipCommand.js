import Command from '../structures/Command'

class SkipCommand extends Command {
  constructor () {
    super('skip')
    this.name = 'Skip'
    this.description = 'Pula uma música'
    this.category = 'Música'
  }
  async run (message, args, { t }) {
    if (!this.client.lavalinkManager.manager.has(message.guild.id)) {
      return message.reply(t('commands:music.notPlaying'))
    }
    if (this.client.player.get(message.guild.id).repeat === true) {
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

export default SkipCommand
