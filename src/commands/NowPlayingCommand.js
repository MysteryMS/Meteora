const Command = require('../structures/Command')
const pms = require('pretty-ms')
const got = require('got')
const splashy = require('splashy')
const { RichEmbed } = require('discord.js')
const yt = require('youtube-info')

class NowPlayingCommand extends Command {
  constructor () {
    super('nowplaying')
    this.name = 'Now Playing'
    this.description = 'Exibe informações da música que está sendo tocada no' +
      ' momento'
    this.aliases = ['np', 'nowPlaying', 'playingnow', 'tocando', 'tocandoagora', 'tocandoagr']
  }
  async run (message, args) {
    if (this.client.calls.get(message.guild.id).nowPlaying === '') {
      return message.reply('Não há nada tocando!')
    }
    yt(this.client.calls.get(message.guild.id).nowPlaying.info.identifier, async (err, videoInfo) => {
      const { body } = await got(videoInfo.thumbnailUrl, { encoding: null })
      const palette = await splashy(body)
      if (err) console.log(err)
      console.log(videoInfo.thumbnailUrl)
      let embed = new RichEmbed()
        .setTitle(message.guild.name)
        .addField('Música:', `[${this.client.calls.get(message.guild.id).nowPlaying.info.title}](${this.client.calls.get(message.guild.id).nowPlaying.info.uri})`)
        .addField('Volume:', this.client.calls.get(message.guild.id).player.state.volume + '/100')
        .addField('Autor:', this.client.calls.get(message.guild.id).nowPlaying.info.author)
        .addField('Duração:', pms(this.client.calls.get(message.guild.id).player.state.position) + '/' + pms(this.client.calls.get(message.guild.id).nowPlaying.info.length))
        .setImage(videoInfo.thumbnailUrl)
        .setColor(palette[0])
      message.channel.send(embed)
    })
  }
}

module.exports = NowPlayingCommand
