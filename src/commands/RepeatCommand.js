const Command = require('../structures/Command')

class RepeatCommand extends Command {
  constructor () {
    super('repeat')
    this.aliases = ['repetir']
    this.name = 'Repeat'
    this.category = 'Música'
  }
  async run (message, args) {
    let player = this.client.calls.get(message.guild.id)
    if (!this.client.lavalinkManager.manager.has(message.guild.id)) return message.channel.send('xuxa morreu')
    if (player.repeat === false) {
      message.channel.send('xuxa on')
      player.repeatTrack = this.client.calls.get(message.guild.id).player.track
      player.repeat = true
      return
    }
    if (player.repeat === true) {
      message.channel.send('xuxa off')
      player.repeatTrack = ''
      player.repeat = false
      return
    }
  }
}

module.exports = RepeatCommand
