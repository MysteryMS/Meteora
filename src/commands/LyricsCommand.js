import { RichEmbed } from 'discord.js'
import GeniusAPI from 'genius-api'
import Lyricist from 'lyricist'
import Command from '../structures/Command'

let genius = new GeniusAPI(process.env.GENIUS_TOKEN)
let lyricist = new Lyricist(process.env.GENIUS_TOKEN)

function chunkString (str) {
  return str.match(/(.|[\r\n]){1,1950}/g)
}

class LyricsCommand extends Command {
  constructor () {
    super('lyrics')

    this.name = 'Lyrics'
    this.aliases = ['letra', 'lyric']
    this.description = 'Exibe a letra de uma música'
    this.category = 'Música'
  }

  async run (message, args, { t }) {
    if (!args[0]) {
      return message.channel.send(t('commands:lyrics.noArgs'))
    }
    genius.search(args.join(' ')).then(async (response) => {
      if (!response || !response.hits || !response.hits[0]) return message.channel.send(t('commands:lyrics.notFound'))

      let lyrics = await lyricist.song(response.hits[0].result.id, { fetchLyrics: true })
      if (!lyrics) message.channel.send(t('commands:lyrics.notFound'))

      let primaryArtist = lyrics.primary_artist.name
      let otherArtists = (lyrics.producer_artists || []).map(a => a.name)

      let embed = new RichEmbed()
        .setAuthor(t('commands:lyrics.seeOnGenius'), 'https://yt3.ggpht.com/a/AGF-l78KfkxP3w_VPAOLVcIbHQaEfKoWpEDMpudm8g=s900-mo-c-c0xffffffff-rj-k-no', lyrics.url)
        .setDescription(`${t('commands:lyrics.music', { music: lyrics.title, artist: primaryArtist })} ${otherArtists.length === 0 ? '' : t('commands:lyrics.producers', { producers: otherArtists.join(', ') })} ${lyrics.album ? t('commands:lyrics.album', { album: lyrics.album.name }) : '(single)'}`)
        .setThumbnail(lyrics.song_art_image_url)
        .setColor('#f0f400')
        .setURL(lyrics.url)
        .setFooter(primaryArtist, lyrics.primary_artist.image_url)

      // await message.channel.send(embed)

      let chunks = chunkString(lyrics.lyrics)
      chunks.forEach((chunk) => {
        message.channel.send(`\`\`\`yaml\n${chunk}\`\`\``)
        message.channel.send(embed)
      })
    })
  }
}

export default LyricsCommand
