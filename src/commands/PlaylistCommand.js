const Command = require('../structures/Command')
class PlaylistCommand extends Command {
  constructor () {
    super('playlist')
    this.name = 'Playlist'
    this.onlyOwner = true
  }

  async run (message, args, server, { t }) {
    switch (args[0]) {
      case 'create': {
        if (server.playlist) return message.reply(t('commands:playlist.onlyOne'))
        if (!args[1]) return message.reply(t('commands:playlist.argueSongs'))
        const songs = args.slice(1)
        server.playlist = new Map().set('1', songs)
        server.save().then(message.reply(t('commands:playlist.created', { prefix: server.prefix })))
        break
      }

      case 'load': {
        if (!message.member.voice.channelID) return message.reply(t('commands:music.noVoiceChannel'))
        if (!server.playlist) return message.reply(t('commands:playlist.noPlaylist'))
        const theMusic = server.playlist.get(`${args[1]}`)
        if (!theMusic) return message.reply(t('commands:playlist.notFound'))
        const player = await this.client.lavalinkManager.join(message.member.voice.channelID)

        player.loadPlaylist(theMusic)

        this.client.player.set(message.guild.id, player)
        player.playlistSongs = theMusic
        player.playlist = true
        player.playlistId = args[1]
        break
      }

      case 'add': {
        const thePlaylist = server.playlist.get(`${args[1]}`)
        if (!thePlaylist) return message.reply(t('commands:playlist.notFound'))
        const newSongs = args.slice(2)
        newSongs.forEach(ab => thePlaylist.push(ab))
        server.playlist = new Map().set(`${args[1]}`, thePlaylist)
        server.save().then(message.reply(t('commands:playlist.newTracks')))
        break
      }

      case 'remove': {
        const playlistDelete = server.playlist.get(`${args[1]}`)
        if (!playlistDelete) return message.reply(t('commands:playlist.notFound'))
        server.playlist = playlistDelete.delete(`${args[1]}`)
        server.save().then(message.reply(t('commands:playlist.deleted')))
        break
      }
    }
  }
}
module.exports = PlaylistCommand
