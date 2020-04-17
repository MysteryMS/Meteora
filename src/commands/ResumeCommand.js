const Command = require('../structures/Command')

class ResumeCommand extends Command {
  constructor () {
    super('resume', ['resumir', 'unpause'])
    this.name = 'Resume'
    this.category = 'music'
  }

  async run (message, args, server, { t }) {
    const player = this.client.lavalinkManager.manager.players.get(message.guild.id)
    if (!player.paused) return message.reply(t('commands:playPause.alreadyPlaying'))
    player.pause(false)
    message.reply(t('commands:playPause.resume'))
  }
}

module.exports = ResumeCommand
