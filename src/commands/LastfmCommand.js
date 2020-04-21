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
    const user = await this.fetch('user.getinfo', args[0].toLowerCase())
    const songs = await this.fetch('user.getrecenttracks', args[0].toLowerCase())
    const topAlbums = await this.fetch('user.gettopalbums&period=7day', args[0].toLowerCase())
    const topArtists = await this.fetch('user.gettopartists&period=7day', args[0].toLowerCase())
    const currentTrack = songs.recenttracks.track[0]
    const emojiMapping = {
      1: ':first_place:',
      2: ':second_place:',
      3: ':third_place:',
      4: '4th',
      5: '5th'
    }

    if (!songs.recenttracks) return message.reply(t('commands:lastfm.nullUser'))
    const recentTracks = songs.recenttracks.track.slice(currentTrack['@attr'] ? 1 : 0, 10).map(t => `\`${t.name}\` - ${t.artist['#text']}`)

    const trackData = currentTrack['@attr'] ? t('commands:lastfm.nowPlaying', { user: user.user.name, track: currentTrack.name, album: currentTrack.album['#text'], artist: currentTrack.artist['#text'] }) : t('commands:lastfm.notPlaying', { user: user.user.name })

    const userEmbed = new MessageEmbed()
      .setAuthor(t('commands:lastfm.profile', { user: user.user.name }), user.user.image[1]['#text'], user.user.url)
      .setDescription(trackData)
      .addField(t('commands:lastfm.recentTracks'), recentTracks)
      .addField(':dvd: Top Albums', topAlbums.topalbums.album.slice(0, 5).map(album => `${emojiMapping[album['@attr'].rank]} \`${album.name}\` (${album.playcount} plays) - ${album.artist.name}`))
      .addField(':woman_singer: Top Artists', topArtists.topartists.artist.slice(0, 5).map(artist => `${emojiMapping[artist['@attr'].rank]} \`${artist.name}\` - ${artist.playcount} plays`))
      .setColor('#ba020e')
      .setFooter('Last.fm', 'https://images-ext-1.discordapp.net/external/RvmwukOFzFgqbYe5qWZVus7f5UcDhEA-0Hs1NUhDP5E/%3Fsize%3D2048/https/cdn.discordapp.com/icons/260438376270921729/a_ada961d5013cd7c6cab00879dd61f82d.png?width=475&height=475')
    // eslint-disable-next-line no-unused-expressions
    currentTrack['@attr'] ? userEmbed.setThumbnail(currentTrack.image[3]['#text'].replace('300x300', '600x600')) : undefined
    message.channel.send(userEmbed)
  }

  fetch (method, query) {
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=${method}&user=${query}&api_key=${process.env.LAST_FM_KEY}&format=json`).then(async res => {
      return res.json()
    })
  }
}

module.exports = LastfmCommand
