const Command = require('../structures/Command')

class PlayCommand extends Command {
  constructor () {
    super('play')
    this.name = 'Play'
    this.description = 'Toque uma música usando um link ou buscando-a'
    this.usage = 'play'
    this.aliases = ['p']
    this.category = 'music'
    this.botPermissions = ['CONNECT', 'SPEAK']
  }

  async run (message, args, server, { t }) {
    const mss = require('pretty-ms')
    if (!args[0]) return this.explain(message)
    if (!message.member.voice.channel) return message.reply(t('commands:music.noVoiceChannel'))
    if (this.client.lavalinkManager.manager.players.has(message.guild.id)) {
      if (!message.member.voice.channelID) return message.reply(t('commands:music.noVoiceChannel'))
      this.client.player.get(message.guild.id).play(args.join(' ')).then(info => {
        if (!info) return message.reply(t('commands:music.noResults'))
        message.channel.send(t('commands:music.addQueue', { track: info.title, duration: mss(info.length) }))
      })
    } else {
      if (!message.member.voice.channelID) return message.reply(t('commands:music.noVoiceChannel'))
      if (!args[0]) {
        return message.reply(t('commands:music.noMusic'))
      }
      const player = await this.client.lavalinkManager.join(message.member.voice.channelID)
      player.channel = message.channel
      this.client.player.set(message.guild.id, player)
      player.play(args.join(' '))
    }
  }
}

module.exports = PlayCommand
