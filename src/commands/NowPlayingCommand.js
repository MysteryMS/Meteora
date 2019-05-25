const Command = require('../structures/Command')
const pms = require('pretty-ms')
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
    let embed = new RichEmbed()
      .setTitle(message.guild.name)
      .addField('Música:', `[${this.client.calls.get(message.guild.id).nowPlaying.title}](${this.client.calls.get(message.guild.id).nowPlaying.uri})`)
      .addField('Volume:', this.client.calls.get(message.guild.id).player.state.volume + '/100')
      .addField('Autor:', this.client.calls.get(message.guild.id).nowPlaying.author)
      .addField('Duração:', pms(this.client.calls.get(message.guild.id).player.state.position) + '/' + pms(this.client.calls.get(message.guild.id).nowPlaying.info.length))
      .setThumbnail(yt(this.client.calls.get(message.guild.id).nowPlaying.info.identifier))
    yt(this.client.calls.get(message.guild.id).nowPlaying.info.identifier, function (err, videoInfo) {
      if (err) console.log(err)
      console.log(videoInfo)
      // embed.setThumbnail(videoInfo.thumbnailUrl)
    })

    message.channel.send(embed)
  }
}

module.exports = NowPlayingCommand
