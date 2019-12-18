const Command = require('../structures/Command')
const parse = require('parse-duration')

class RewindCommand extends Command {
  constructor () {
    super('rewind')
    this.aliases = ['voltar', 'backmusic', 'rwd']
    this.name = 'Rewind'
    this.description = 'Volta a música em um determinado tempo'
    this.usage = '<tempo(s/m/h)>'
    this.category = 'Música'
  }
  async run (message, args, server, { t }) {
    const lavaPlayer = this.client.player.get(message.guild.id)
    if (!this.client.lavalinkManager.manager.has(message.guild.id)) {
      return message.reply(t('commands:music.notPlaying'))
    }
    if (parse(args[0]) > lavaPlayer.player.state.position) {
      return message.reply(t('commands:music.maxDuration'))
    }
    lavaPlayer.player.seek(lavaPlayer.player.state.position - parse(args[0]))
    return message.channel.send('⏪')
  }
}

module.exports = RewindCommand
