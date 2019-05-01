const Command = require('../structures/Command')

class SkipCommand extends Command {
  constructor() {
    super('skip')
    this.name = 'Skip'
    this.description = 'Pula uma música'
  }
  async run(message, args) {
    if (!this.client.lavalinkManager.manager.has(message.guild.id)) {
      return message.reply('Não estou tocando nada!')
    }

    if (this.client.calls.get(message.guild.id).queue.length === 0) {
      message.channel.send('⏭ – Música Pulada!').then(() => this.client.calls.get(message.guild.id).player.stop())
    } else {
      message.channel.send('⏭ – Música Pulada!').then(() => this.client.calls.get(message.guild.id).skip())
    }
  }
}

module.exports = SkipCommand