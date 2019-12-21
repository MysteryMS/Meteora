const Command = require('../structures/Command')
const mss = require('pretty-ms')

class PlaylistCommand extends Command {
  constructor () {
    super('playlist')
    this.name = 'Playlist'
    this.onlyOwner = true
  }

  async run (message, args, server, { t }) {
    /* switch (args[0]) {
      case 'create':
        if (!args[2]) return message.reply('no...')
        let songs = args.slice(1)
        await message.reply(songs)
    } */
    let player = await this.client.lavalinkManager.join(message.member.voiceChannel.id)
    let playlist = ['aurora soft universe','charlie puth attenttion', 'the river aurora', 'in bottle aurora']

    player.loadPlaylist(playlist)

    this.client.player.set(message.guild.id, player)
    this.client.player.get(message.guild.id).player.playlistSongs = playlist
    this.client.player.get(message.guild.id).player.playlist = true

    player.on('nowPlaying', track => {
      let a = this.client.localeManager.getT(server.language)
      message.channel.send(a('commands:music.nowPlaying', {
        trackInfo: track.info.title ? track.info.title : 'Sem Título',
        trackDuration: mss(track.info.length)
      }))
      this.client.player.get(message.guild.id).nowPlaying = track
      this.client.player.get(message.guild.id).messageChannel = message.channel.id
    })
  }
}
module.exports = PlaylistCommand
