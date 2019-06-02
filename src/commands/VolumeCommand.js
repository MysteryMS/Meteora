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
    if (!args[0]) return this.explain
    if (!parseInt(args[0])) {
      return message.reply(t('commands:music.nan'))
    }
    if (parseInt(args[0]) >= 151) {
      return message.reply(t('commands:music.maxVolume'))
    }
    this.client.calls.get(message.guild.id).volume(parseInt(args[0])).then(() => message.reply(t('commands:music.volChanged', { volume: parseInt(args[0]) })))
  }
}