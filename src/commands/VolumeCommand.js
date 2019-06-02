const Command = require('../structures/Command')

class VolumeCommand extends Command {
  constructor () {
    super('volume')
    this.name = 'Volume'
    this.category = 'Música'
    this.aliases = ['vl']
    this.explain = '<volume>'
  }
  async run (message, args, { t }) {
    if (!this.client.lavalinkManager.manager.has(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    if (isNaN(parseInt(args[0]))) {
      return message.reply(t('commands:music.nan'))
    }
    if (parseInt(args[0]) >= 151) {
      return message.reply(t('commands:music.maxVolume'))
    }
    this.client.calls.get(message.guild.id).player.volume(parseInt(args[0])).then(() => message.reply(t('commands:music.volChanged', { volume: parseInt(args[0]) })))
  }
}

module.exports = VolumeCommand
