const { MessageEmbed } = require('discord.js')
const Lyricist = require('lyricist')
const Command = require('../structures/Command')
const fetch = require('node-fetch')
const lyricist = new Lyricist(process.env.GENIUS_TOKEN)

class LyricsCommand extends Command {
  constructor () {
    super('lyrics')

    this.name = 'Lyrics'
    this.aliases = ['letra', 'lyric']
    this.description = 'Exibe a letra de uma música'
    this.category = 'music'
    this.usage = 'lyrics'
  }

  async run (message, args, server, { t }) {
    if (!args[0]) return this.explain(message)
    const query = args.splice(1).join(' ')
    fetch(`https://api.genius.com/search?q=${query}`, {
      method: 'get',
      headers: { Authorization: `Bearer ${process.env.GENIUS_TOKEN}` }
    }).then(async r => {
      const response = await r.json()
      if (!response.response.hits) return message.channel.send(t('commands:lyrics.notFound'))

      const lyrics = await lyricist.song(response.response.hits[0].result.id, { fetchLyrics: true })
      if (!lyrics) message.channel.send(t('commands:lyrics.notFound'))

      const primaryArtist = lyrics.primary_artist.name
      const otherArtists = (lyrics.producer_artists || []).map(a => a.name)

      const embed = new MessageEmbed()
        .setAuthor(t('commands:lyrics.seeOnGenius'), 'https://yt3.ggpht.com/a/AGF-l78KfkxP3w_VPAOLVcIbHQaEfKoWpEDMpudm8g=s900-mo-c-c0xffffffff-rj-k-no', lyrics.url)
        .setDescription(`${t('commands:lyrics.music', { music: lyrics.title, artist: primaryArtist })} ${otherArtists.length === 0 ? '' : t('commands:lyrics.producers', { producers: otherArtists.join(', ') })} ${lyrics.album ? t('commands:lyrics.album', { album: lyrics.album.name }) : '(single)'}`)
        .setThumbnail(lyrics.song_art_image_url)
        .setColor('#fdfa3e')
        .setURL(lyrics.url)
        .setFooter(primaryArtist, lyrics.primary_artist.image_url)
      message.channel.send(`${lyrics.lyrics}`, { split: true, code: 'ini' })
      message.channel.send(embed)
    })
  }
}

module.exports = LyricsCommand
