const Command = require('../structures/Command')

class ShuffleCommand extends Command {
  constructor () {
    super('shuffle', ['sh'])
    this.category = 'music'
  }

  async run (message, args, server, { t }) {
    if (!this.client.lavalinkManager.manager.players.get(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    this.client.player.get(message.guild.id).shuffle()
    await message.reply(t('commands:shuffle'))
  }
}

module.exports = ShuffleCommand
