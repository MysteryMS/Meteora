const Command = require('../structures/Command')
const parse = require('parse-duration')

class ForwardCommand extends Command {
  constructor () {
    super('forward')
    this.name = 'Forward'
    this.aliases = ['fwd', 'avançar']
    this.category = 'music'
    this.usage = 'forward'
  }

  async run (message, args, server, { t }) {
    const player = this.client.lavalinkManager.manager.players.get(message.guild.id)
    if (!player) return message.reply(t('commands:music.notPlaying'))
    if (player.playing && player.paused) return message.reply(t('commands:music.notPlaying'))
    if (Number(args[0]) && (Number(args[0]) === 0 || Number(args[0]) < 0 || String(args[0].toLowerCase()) === 'infinity')) return message.reply(t('commands:forward.moreThanZero'))
    this.client.player.get(message.guild.id).seek(parse(args[0]) + this.client.player.get(message.guild.id).player.state.position)
    message.channel.send(t('commands:forward.forwarded'))
  }
}

module.exports = ForwardCommand
