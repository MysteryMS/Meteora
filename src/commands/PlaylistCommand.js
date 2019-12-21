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
    let playlist = this.client.player.get(message.guild.id).player.playlistSongs = ['dont start now video', 'the river aurora', 'conqueror aurora']

    player.play(playlist[0])

    this.client.player.set(message.guild.id, player)
    this.client.player.get(message.guild.id).player.playlist = true
  }
}
module.exports = PlaylistCommand
