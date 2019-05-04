const Command = require('../structures/Command')
const guild = require('../../models/guild')

class PlayCommand extends Command {
  constructor() {
    super('play')
    this.name = 'Play'
    this.description = 'Toque uma música usando um link ou buscando-a'
    this.usage = '<link/nome>'
  }

  async run(message, args, { t }) {
    const mss = require('pretty-ms')
    if (!message.member.voiceChannel) return message.reply(t('commands:music.noVoiceChannel'))

    if (!args[0]) return message.reply(t('commands:music.noMusic'))

    if (this.client.lavalinkManager.manager.has(message.guild.id)) {
      this.client.calls.get(message.guild.id).play(args.join(' ')).then(info => {
        message.channel.send(t('commands:music.addQueue', {track: info.title, duration: mss(info.length)}))

      })
    } else {
      if (!message.member.voiceChannel) return message.reply(t('commands:music.noVoiceChannel'))
      if (!args[0]) {
        return message.reply(t('commands:music.noMusic'))
      }
      let player = await this.client.lavalinkManager.join(message.member.voiceChannel.id)
      player.on('playingNow', track => {
        guild.findOne({_id: message.guild.id}, (err, database) => {
         this.client.getT(database.lang)
        message.channel.send(t('commands:music.nowPlaying', {trackInfo: track.info.title, trackDuration: mss(track.info.length)}))
        this.client.calls.get(message.guild.id).playingNow = track
})
      })
      player.play(args.join(' '))
      this.client.calls.set(message.guild.id, player)
    }
  }
}

module.exports = PlayCommand
