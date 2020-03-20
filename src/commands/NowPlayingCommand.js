const Command = require('../structures/Command')
const pms = require('pretty-ms')
const got = require('got')
const splashy = require('splashy')
const { MessageEmbed } = require('discord.js')
const yt = require('youtube-info')

class NowPlayingCommand extends Command {
  constructor () {
    super('nowplaying')
    this.name = 'NowPlaying'
    this.description = 'Exibe informações da música que está sendo tocada no' +
      ' momento'
    this.aliases = ['np', 'nowPlaying', 'playMusic', 'tocando', 'tocandoagora', 'tocandoagr']
    this.category = 'Música'
  }

  async run (message, args) {
    if (this.client.player.get(message.guild.id).nowPlaying === '') return message.reply('Não há nada tocando!')
    const p = this.client.player.get(message.guild.id)
    yt(this.client.player.get(message.guild.id).nowPlaying.info.identifier, async (err, videoInfo) => {
      const { body } = await got(videoInfo.thumbnailUrl, { encoding: null })
      const palette = await splashy(body)
      if (err) console.log(err)
      const embed = new MessageEmbed()
        .setTitle(message.guild.name)
        .addField('Música:', `[${p.nowPlaying.info.title}](${this.client.player.get(message.guild.id).nowPlaying.info.uri})`, true)
        .addField('Volume:', p.player.state.volume + '/100', true)
        .addField('Autor:', p.nowPlaying.info.author)
        .addField('Duração:', pms(p.player.state.position) + '/' + pms(p.nowPlaying.info.length), true)
        .setImage(videoInfo.thumbnailUrl)
        .setColor(palette[0])
      await message.channel.send(embed)
    })
  }
}

module.exports = NowPlayingCommand
