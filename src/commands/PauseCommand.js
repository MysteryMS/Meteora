const Command = require('../structures/Command')

class PauseCommand extends Command {
  constructor () {
    super('pause', ['pausar'])
    this.name = 'Pause'
    this.category = 'music'
  }

  async run (message, args, server, { t }) {
    const player = this.client.lavalinkManager.manager.players.get(message.guild.id)
    if (!player || player.playing) return message.reply(t('commands:music.notPlaying'))
    if (player.paused) return message.reply(t('commands:playPause.alreadyPaused'))
    player.pause(true)
    await message.reply(t('commands:playPause.paused'))
  }
}

module.exports = PauseCommand
