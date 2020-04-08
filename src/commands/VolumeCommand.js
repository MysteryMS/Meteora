const Command = require('../structures/Command')

class VolumeCommand extends Command {
  constructor () {
    super('volume')
    this.name = 'Volume'
    this.category = 'music'
    this.aliases = ['vl', 'vol']
    this.usage = 'volume'
  }

  async run (message, args, server, { t }) {
    if (!args[0]) return this.explain(message)
    if (!this.client.lavalinkManager.manager.players.has(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    if (isNaN(parseInt(args[0]))) return message.reply(t('commands:music.nan'))
    if (parseInt(args[0]) >= 151) return message.reply(t('commands:music.maxVolume'))

    await this.client.player.get(message.guild.id).player.volume(parseInt(args[0]))
    await message.reply(t('commands:music.volChanged', { volume: parseInt(args[0]) }))
  }
}

module.exports = VolumeCommand
