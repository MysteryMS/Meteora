const Command = require('../structures/Command')
const guild = require('../../models/guild')

class PlayCommand extends Command {
  constructor () {
    super('play')
    this.name = 'Play'
    this.description = 'Toque uma música usando um link ou buscando-a'
    this.usage = '<link/nome>'
    this.category = 'Música'
  }

  async run (message, args, server, { t }) {
    const mss = require('pretty-ms')
    if (!message.member.voiceChannel) return message.reply(t('commands:music.noVoiceChannel'))

    if (!args[0]) return message.reply(t('commands:music.noMusic'))

    if (this.client.lavalinkManager.manager.has(message.guild.id)) {
      this.client.player.get(message.guild.id).play(args.join(' ')).then(info => {
        message.channel.send(t('commands:music.addQueue', { track: info.title ? info.title : 'Sem Título', duration: mss(info.length) }))
      })
    } else {
      if (!message.member.voiceChannel) return message.reply(t('commands:music.noVoiceChannel'))
      if (!args[0]) {
        return message.reply(t('commands:music.noMusic'))
      }
      let player = await this.client.lavalinkManager.join(message.member.voiceChannel.id)
      player.on('nowPlaying', track => {
        guild.findOne({ _id: message.guild.id }, (err, database) => {
          if (err) console.log(err)
          t = this.client.localeManager.getT(database.language)
          message.channel.send(t('commands:music.nowPlaying', { trackInfo: track.info.title ? track.info.title : 'Sem Título', trackDuration: mss(track.info.length) }))
          this.client.player.get(message.guild.id).nowPlaying = track
          this.client.player.get(message.guild.id).messageChannel = message.channel.id
        })
      })
      player.play(args.join(' '))
      this.client.player.set(message.guild.id, player)
    }
  }
}

module.exports = PlayCommand
