const Command = require('../structures/Command')

class RemoveQueue extends Command {
  constructor () {
    super('removemusic')
    this.name = 'RemoveMusic'
    this.category = 'Música'
  }
  async run (message, args, server, { t }) {
    let player = this.client.player.get(message.guild.id)
    if (isNaN(parseInt(args[0]))) return message.reply(t('commands:music.nan'))
    message.channel.send(t('commands:music.removedQueue', { track: player.queue[args[0] - 1].info.title }))
    player.queue.splice(args[0] - 1, 1)
  }
}

module.exports = RemoveQueue
