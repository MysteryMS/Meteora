const Command = require('../structures/Command')

class BassBoostCommand extends Command {
  constructor () {
    super('bassboost', ['bb'])
    this.category = 'music'
    this.beta = true
  }

  async run (message, args, server, { t }) {
    const player = this.client.player.get(message.guild.id)
    if (!message.member.voice.channel) return message.reply(t('commands:music.noVoiceChannel'))
    if (!this.client.lavalinkManager.manager.players.get(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    if (player.bb) {
      player.bassboost(false)
      message.channel.send(t('commands:bassboost.disabling'))
    } else {
      player.bassboost(true)
      message.channel.send(t('commands:bassboost.enabling'))
    }
  }
}

module.exports = BassBoostCommand
