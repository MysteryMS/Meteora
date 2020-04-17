const Command = require('../structures/Command')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class LastfmCommand extends Command {
  constructor () {
    super('lastfm')
    this.name = 'LastFM'
    this.category = 'music'
    this.usage = 'lastfm'
  }

  async run (message, args, server, { t }) {
    if (!args[0]) return this.explain(message)
    const userRes = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${args[0].toLowerCase()}&api_key=afb11275992190009c27cad73bd65129&format=json`)
    const user = await userRes.json()

    const usersongsRes = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${args[0].toLowerCase()}&api_key=afb11275992190009c27cad73bd65129&format=json`)
    const userSongs = await usersongsRes.json()
    const currentTrack = userSongs.recenttracks.track[0]
    if (!currentTrack) return message.reply(t('commands:lastfm.nullUser'))
    const recentTracks = userSongs.recenttracks.track.slice(currentTrack['@attr'] ? 1 : 0, 10).map(t => `\`${t.name}\` - ${t.artist['#text']}`)

    const nowplayingTrack = currentTrack['@attr'] ? t('commands:lastfm.nowPlaying', { user: user.user.name, track: currentTrack.name, album: currentTrack.album['#text'], artist: currentTrack.artist['#text'] }) : t('commands:lastfm.notPlaying', { user: user.user.name })
    const userEmbed = new MessageEmbed()
      .setAuthor(t('commands:lastfm.profile', { user: user.user.name }), user.user.image[1]['#text'], user.user.url)
      .setDescription(nowplayingTrack)
      .addField(t('commands:lastfm.recentTracks'), recentTracks)
      .setColor('#d31f27')
      .setFooter('Last.fm', 'https://pt.seaicons.com/wp-content/uploads/2015/06/last.fm-icon.png')
    // eslint-disable-next-line no-unused-expressions
    currentTrack['@attr'] ? userEmbed.setThumbnail(currentTrack.image[3]['#text']) : undefined
    message.channel.send(userEmbed)
  }
}

module.exports = LastfmCommand
