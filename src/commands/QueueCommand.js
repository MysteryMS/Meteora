const Command = require('../structures/Command')
const { RichEmbed } = require('discord.js')
const mss = require('pretty-ms')

class QueueCommand extends Command {
  constructor () {
    super('queue')
    this.name = 'Queue'
    this.category = 'Música'
    this.aliases = ['fila']
  }
  async run (message, args, { t }) {
    if (!this.client.lavalinkManager.manager.has(message.guild.id) || this.client.calls.get(message.guild.id).queue.length === 0) return message.reply(t('commands:music.noQueue'))
    let player = this.client.calls.get(message.guild.id)
    let embed = new RichEmbed().setAuthor(`Fila de ${message.guild.name}`, message.guild.iconURL)
    player.queue.forEach((track, i) => embed.addField(`${i + 1} – ${track.info.title}`, mss(track.info.length)))
    message.channel.send(embed)
    if (args[0] === 'delete') {
      if (isNaN(parseInt(args[1]))) return message.reply(t('commands:music.nan'))
      let splice = player.queue.splice(args[1] - 1, 1)
      message.channel.send(t('commands:music.removedQueue', { track: splice.info.title }))
    }
  }
}

module.exports = QueueCommand
