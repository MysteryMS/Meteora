import Command from '../structures/Command'
import pms from 'pretty-ms'
import got from 'got'
import splashy from 'splashy'
import { RichEmbed } from 'discord.js'
import yt from 'youtube-info'

class NowPlayingCommand extends Command {
  constructor () {
    super('nowplaying')
    this.name = 'NowPlaying'
    this.description = 'Exibe informações da música que está sendo tocada no' +
      ' momento'
    this.aliases = ['np', 'nowPlaying', 'playingnow', 'tocando', 'tocandoagora', 'tocandoagr']
    this.category = 'Música'
  }
  async run (message, args) {
    if (this.client.player.get(message.guild.id).nowPlaying === '') {
      return message.reply('Não há nada tocando!')
    }
    yt(this.client.player.get(message.guild.id).nowPlaying.info.identifier, async (err, videoInfo) => {
      const { body } = await got(videoInfo.thumbnailUrl, { encoding: null })
      const palette = await splashy(body)
      if (err) console.log(err)
      console.log(videoInfo.thumbnailUrl)
      let embed = new RichEmbed()
        .setTitle(message.guild.name)
        .addField('Música:', `[${this.client.player.get(message.guild.id).nowPlaying.info.title}](${this.client.player.get(message.guild.id).nowPlaying.info.uri})`, true)
        .addField('Volume:', this.client.player.get(message.guild.id).player.state.volume + '/100', true)
        .addField('Autor:', this.client.player.get(message.guild.id).nowPlaying.info.author, true)
        .addField('Duração:', pms(this.client.player.get(message.guild.id).player.state.position) + '/' + pms(this.client.player.get(message.guild.id).nowPlaying.info.length), true)
        .setImage(videoInfo.thumbnailUrl)
        .setColor(palette[0])
      message.channel.send(embed)
    })
  }
}

export default NowPlayingCommand
