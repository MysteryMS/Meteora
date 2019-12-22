const Command = require('../structures/Command')
const mss = require('pretty-ms')

class PlaylistCommand extends Command {
  constructor () {
    super('playlist')
    this.name = 'Playlist'
    this.onlyOwner = true
  }

  async run (message, args, server, { t }) {
    switch (args[0]) {
      case 'create':
        if (server.playlist) return message.reply(t('commands:playlist.onlyOne'))
        if (!args[1]) return message.reply(t('commands:playlist.argueSongs'))
        let songs = args.slice(1)
        server.playlist = new Map().set('1', songs)
        server.save().then(message.reply(t('commands:playlist.created', { prefix: server.prefix })))
        break

      case 'load':
        if (!message.member.voiceChannelID) return message.reply(t('commands:music.noVoiceChannel'))
        if (!server.playlist) return message.reply(t('commands:playlist.noPlaylist'))
        let theMusic = server.playlist.get(`${args[1]}`)
        if (!theMusic) return message.reply(t('commands:playlist.notFound'))
        let player = await this.client.lavalinkManager.join(message.member.voiceChannel.id)

        player.loadPlaylist(theMusic)

        this.client.player.set(message.guild.id, player)
        this.client.player.get(message.guild.id).player.playlistSongs = theMusic
        this.client.player.get(message.guild.id).player.playlist = true
        this.client.player.get(message.guild.id).player.playlistId = args[1]

        player.on('nowPlaying', track => {
          let a = this.client.localeManager.getT(server.language)
          message.channel.send(a('commands:music.nowPlaying', {
            trackInfo: track.info.title ? track.info.title : 'Sem Título',
            trackDuration: mss(track.info.length)
          }))
          this.client.player.get(message.guild.id).nowPlaying = track
          this.client.player.get(message.guild.id).messageChannel = message.channel.id
        })
        break

      case 'add':
        let thePlaylist = server.playlist.get(`${args[1]}`)
        if (!thePlaylist) return message.reply(t('commands:playlist.notFound'))
        let newSongs = args.slice(2)
        newSongs.forEach(ab => thePlaylist.push(ab))
        server.playlist = new Map().set(`${args[1]}`, thePlaylist)
        server.save().then(message.reply(t('commands:playlist.newTracks')))
        break

      case 'remove':
        let playlistDelete = server.playlist.get(`${args[1]}`)
        if (!playlistDelete) return message.reply(t('commands:playlist.notFound'))
        server.playlist = playlistDelete.delete(`${args[1]}`)
        server.save().then(message.reply(t('commands:playlist.deleted')))
    }
  }
}
module.exports = PlaylistCommand
