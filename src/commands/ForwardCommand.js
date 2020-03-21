const Command = require('../structures/Command')
const parse = require('parse-duration')

class ForwardCommand extends Command {
  constructor () {
    super('foward')
    this.name = 'Foward'
    this.aliases = ['fwd']
  }
  async run (message, args, server, { t }) {
    if (!this.client.lavalinkManager.manager.players.has(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    if (parse(args[0]) === 0) return message.reply(t('commands:forward.error'))
    this.client.player.get(message.guild.id).seek(parse(args[0]) + this.client.player.get(message.guild.id).player.state.position)
    message.channel.send(t('commands.forward:forwarded'))
  }
}

module.exports = ForwardCommand
