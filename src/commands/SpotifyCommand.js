const Command = require('../structures/Command')
const splashy = require('splashy')
const got = require('got')
const moment = require('moment')

const { MessagEmbed } = require('discord.js')

class SpotifyCommand extends Command {
  constructor () {
    super('spotify')
    this.name = 'Spotify'
    this.description = 'Veja as informações de uma música que algum usuário' +
      ' está ouvindo'
    this.usage = '<ID>'
    this.category = 'Música'
  }

  async run (message, args) {
    const embed = new MessagEmbed()
    const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member
    if (user.presence.game.name !== 'Spotify' || null) return message.reply('O usuário não está ouvindo nada!')
    const spot = user.presence

    embed.setTitle(`<:ispotefai:571513977717260288> Spotify de ${user.user.username}`)
    embed.setDescription(`🔠 **Nome da música**: ${spot.game.details}\n\n🎤 **Cantor(a)**: ${spot.game.state}\n\n📀 **Álbum**: ${spot.game.assets.largeText}\n\n🕘 **Duração**: ${moment(spot.game.timestamps.end).format('mm') - moment(spot.game.timestamps.start).format('mm')}:${moment(spot.game.timestamps.end).format('ss') - moment(spot.game.timestamps.start).format('ss')}\n\n\nOuça essa música clicando [aqui](${'https://open.spotify.com/track/' + spot.game.syncID})!`)
    embed.setThumbnail(spot.game.assets.largeImageURL)
    const url = spot.game.assets.largeImageURL
    const { body } = await got(url, { encoding: null })
    const palette = await splashy(body)
    embed.setColor(palette[0])

    message.channel.send(embed)
  }
}

module.exports = SpotifyCommand
