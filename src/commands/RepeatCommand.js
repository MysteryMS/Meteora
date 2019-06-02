const Command = require('../structures/Command')

class RepeatCommand extends Command {
  constructor () {
    super('repeat')
    this.aliases = ['repetir']
    this.name = 'Repeat'
    this.category = 'Música'
  }
  async run (message, args, { t }) {
    let player = this.client.calls.get(message.guild.id)
    if (!this.client.lavalinkManager.manager.has(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    if (this.client.calls.get(message.guild.id).nowPlaying === '') return message.reply(t('commands:music.notPlaying'))
    if (player.repeat === false) {
      message.channel.send(t('commands:music.repeatOn', { music: this.client.calls.get(message.guild.id).nowPlaying.info.title }))
      player.repeatTrack = this.client.calls.get(message.guild.id).player.track
      player.repeat = true
      return
    }
    if (player.repeat === true) {
      message.channel.send(t('commands:music.repeatOff'))
      player.repeatTrack = ''
      player.repeat = false
      return
    }
  }
}

module.exports = RepeatCommand
