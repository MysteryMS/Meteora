const Command = require('../structures/Command')
const { MessageEmbed } = require('discord.js')
const mss = require('pretty-ms')
const info = require('yt-scraper')

class QueueCommand extends Command {
  constructor () {
    super('queue')
    this.name = 'Queue'
    this.category = 'music'
    this.aliases = ['fila', 'q']
  }

  async run (message, args, server, { t }) {
    if (!this.client.lavalinkManager.manager.players.has(message.guild.id) || this.client.player.get(message.guild.id).queue.length === 0) return message.reply(t('commands:music.noQueue'))
    const embed = new MessageEmbed().setAuthor(t('commands:music.queue', { guild: message.guild.name }), message.guild.iconURL()).setColor('#9dffe0')

    if (this.client.player.get(message.guild.id).player.playlist === true) {
      server.playlist.get(this.client.player.get(message.guild.id).player.playlistId).forEach((a, i) => {
        info.videoInfo(a).then(b => { embed.addField(`${i + 1} – b.title`, `${b.views} views`) })
        message.channel.send(embed)
      })
    }
    const player = this.client.player.get(message.guild.id)
    player.queue.forEach((track, i) => embed.addField(`${i + 1} – ${track.info.title}`, mss(track.info.length)))
    await message.channel.send(embed)
  }
}

module.exports = QueueCommand
