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
        if (server.playlist) return message.reply('Atuazlmente, servidores têm um limite de uma playlist.')
        if (!args[1]) return message.reply('Especifique as músicas que você deseja adicionar.\n_A música precisa estar com o link no formato `youtu.be`_')
        let songs = args.slice(1)
        server.playlist = new Map().set('1', songs)
        server.save().then(message.reply(`Playlist criada com sucesso!\nUtilize \`${server.prefix}playlist load 1\` para tocá-la `))
        break

      case 'load':
        if (!message.member.voiceChannelID) return message.reply(t('commands:music.noVoiceChannel'))
        if (!server.playlist) return message.reply('Poxa... parece que você não tem nenhuma playlist ainda. Que tal criar uma?!')
        let theMusic = server.playlist.get(`${args[1]}`)
        if (!theMusic) return message.reply('Hmmm... essa playlist não foi encontrada. Tem certeza que você colocou o número certo?!')
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
        if (!thePlaylist) return message.reply('Hmmm... essa playlist não foi encontrada. Tem certeza que você colocou o número certo?!')
        let newSongs = args.slice(1)
        let newPlaylist = newSongs.forEach(a => thePlaylist.push(a))
        server.playlist = newPlaylist
        server.save().then(message.reply('Novas faixas adicionadas com sucesso!'))
        break
      case 'remove':
        let playlistDelete = server.playlist.get(`${args[1]}`)
        if (!playlistDelete) return message.reply('Hmmm... essa playlist não foi encontrada. Tem certeza que você colocou o número certo?!')
        server.playlist = playlistDelete.delete(`${args[1]}`)
        server.save().then(message.reply('Playlist deletada com sucesso!'))
    }
  }
}
module.exports = PlaylistCommand
