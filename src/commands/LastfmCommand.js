const Command = require('../structures/Command')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class LastfmCommand extends Command {
  constructor () {
    super('lastfm')
    this.name = 'LastFM'
    this.category = 'beta'
    this.beta = true
    this.usage = 'lastfm'
  }

  async run (message, args, server, { t }) {
    if (!args[0]) return this.explain(message)
    const userRes = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${args[0].toLowerCase()}&api_key=afb11275992190009c27cad73bd65129&format=json`)
    const user = await userRes.json()

    const usersongsRes = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${args[0].toLowerCase()}&api_key=afb11275992190009c27cad73bd65129&format=json`)
    const userSongs = await usersongsRes.json()
    const currentTrack = userSongs.recenttracks.track[0]
    if (!currentTrack) return message.reply('nao achou..')
    const recentTracks = userSongs.recenttracks.track.slice(currentTrack['@attr'] ? 1 : 0, 11).map(t => `\`${t.name}\` - [${t.artist['#text']}]`)

    const nowplayingTrack = currentTrack['@attr'] ? `${user.user.name} is **now playing** \`${currentTrack.name}\`, on \`${currentTrack.album['#text']}\` by \`${currentTrack.artist['#text']}\`` : `${user.user.name} is not listening at the moment.`
    const userEmbed = new MessageEmbed()
      .setAuthor(`${user.user.name}'s Profile`, user.user.image[1]['#text'], user.user.url)
      .setDescription(nowplayingTrack)
      .addField('Recent played tracks', recentTracks)
      .setColor('#d31f27')
      .setFooter('Last.fm', 'https://pt.seaicons.com/wp-content/uploads/2015/06/last.fm-icon.png')
    // eslint-disable-next-line no-unused-expressions
    currentTrack['@attr'] ? userEmbed.setThumbnail(currentTrack.image[3]['#text']) : undefined
    message.channel.send(userEmbed)
  }
}

module.exports = LastfmCommand
