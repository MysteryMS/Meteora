const Command = require('../structures/Command')

class RepeatCommand extends Command {
  constructor () {
    super('repeat')
    this.aliases = ['repetir']
  }
  async run (message, args) {
    if (!this.client.lavalinkManager.manager.has(message.guild.id)) return message.channel.send('xuxa morreu')
    message.channel.send('xuxa ok')
    this.client.calls.get(message.guild.id).repeatTrack(this.client.calls.get(message.guild.id).player.track)
  }
}

module.exports = RepeatCommand
