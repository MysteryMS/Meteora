const { RichEmbed } = require('discord.js')
const GeniusAPI = require('genius-api')
const Lyricist = require('lyricist')
const Command = require('../structures/Command')

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

  async run (message, args) {
    if (!args[0]) {
      return message.channel.send('Você deve colocar o nome de' +
      ' uma' +
      ' música!')
    }
    genius.search(args.join(' ')).then(async (response) => {
      if (!response || !response.hits || !response.hits[0]) return message.channel.send('Não achei essa música!')

      let lyrics = await lyricist.song(response.hits[0].result.id, { fetchLyrics: true })
      if (!lyrics) message.channel.send('Música não encontrada...')

      let primaryArtist = lyrics.primary_artist.name
      let otherArtists = (lyrics.producer_artists || []).map(a => a.name)

      let embed = new RichEmbed()
        .setAuthor('Ver letra em genius.com', 'https://yt3.ggpht.com/a/AGF-l78KfkxP3w_VPAOLVcIbHQaEfKoWpEDMpudm8g=s900-mo-c-c0xffffffff-rj-k-no', lyrics.url)
        .setDescription(`Exibindo letra de \`${lyrics.title}\`, por \`${primaryArtist} ${otherArtists.length === 0 ? '' : '(Produtores: ' + otherArtists.join(', ') + ')'}\`${lyrics.album ? 'do álbum `' + lyrics.album.name + '`' : ' (single)'}`)
        .setThumbnail(lyrics.song_art_image_url)
        .setColor('#f0f400')
        .setURL(lyrics.url)
        .setFooter(primaryArtist, lyrics.primary_artist.image_url)

      // await message.channel.send(embed)

      let chunks = chunkString(lyrics.lyrics)
      chunks.forEach(async (chunk) => {
        await message.channel.send(`\`\`\`yaml\n${chunk}\`\`\``)
        await message.channel.send(embed)
      })
    })
  }
}

module.exports = LyricsCommand
