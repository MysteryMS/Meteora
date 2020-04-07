const Command = require('../structures/Command')
const parse = require('parse-duration')

class RewindCommand extends Command {
  constructor () {
    super('rewind')
    this.aliases = ['voltar', 'backmusic', 'rwd', 'retroceder']
    this.name = 'Rewind'
    this.description = 'Volta a música em um determinado tempo'
    this.usage = '<tempo(s/m/h)>'
    this.category = 'music'
  }

  async run (message, args, server, { t }) {
    const lavaPlayer = this.client.player.get(message.guild.id)
    const player = this.client.lavalinkManager.manager.players.get(message.guild.id)
    if (!player) return message.reply(t('commands:music.notPlaying'))
    if (player.playing && player.paused) return message.reply(t('commands:music.notPlaying'))
    if (Number(args[0]) > lavaPlayer.player.state.position) {
      await lavaPlayer.player.seek(0)
      return message.reply(t('commands:rewind.rewound'))
    }
    if (Number(args[0]) === 0) return message.reply(t('commands:rewind.moreThanZero'))
    await lavaPlayer.player.seek(lavaPlayer.player.state.position - parse(args[0]))
    return message.channel.send(t('commands:rewind.rewound'))
  }
}

module.exports = RewindCommand
