const Command = require('../structures/Command')
const parse = require('parse-duration')

class RewindCommand extends Command {
    constructor() {
        super('rewind')
        this.aliases = ['voltar']
        this.name = 'Rewind'
        this.description = 'Volta a música em um determinado tempo'
        this.usage = '<tempo(s/m/h)'
    }
    async run(message, args, { t }) {
        const lavaPlayer = this.client.calls.get(message.guild.id)
        if (!this.client.lavalinkManager.manager.has(message.guild.id)) {
            return message.reply(t('commands:music.notPlaying'))
        }
        if (!lavaPlayer.nowPlaying) {
            return message.reply(t('commands:music.notPlaying'))
        }
      if (parse(args[0]) > lavaPlayer.player.state.position) {
          message.reply(t('commands:music.maxDuration'))
      }
      lavaPlayer.seek(parse[0] - lavaPlayer.player.state.position)
    }
}

module.exports = RewindCommand
