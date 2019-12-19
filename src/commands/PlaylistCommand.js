const Command = require('../structures/Command')

class PlaylistCommand extends Command {
  constructor () {
    super('playlist')
    this.name = 'Playlist'
  }
  async run (message, args, server, { t }) {
    /* switch (args[0]) {
      case 'create':
        if (!args[2]) return message.reply('no...')
        let songs = args.slice(1)
        await message.reply(songs)
    } */
    let player = await this.client.lavalinkManager.join(message.member.voiceChannel.id)
    let playlist = this.client.lavalinkManager.playlistSongs = ['dont start' +
    ' now', 'the' +
    ' river aurora', 'conqueror aurora']
    player.play(playlist.shift())
    this.client.player.set(message.guild.id, player)
  //  await this.client.lavalinkManager.loadPlaylist(playlist)
  }
}

module.exports = PlaylistCommand
