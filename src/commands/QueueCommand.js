import Command from '../structures/Command'
import { RichEmbed } from 'discord.js'
import mss from 'pretty-ms'

class QueueCommand extends Command {
  constructor () {
    super('queue')
    this.name = 'Queue'
    this.category = 'Música'
    this.aliases = ['fila']
  }
  async run (message, args, { t }) {
    if (!this.client.lavalinkManager.manager.has(message.guild.id) || this.client.player.get(message.guild.id).queue.length === 0) return message.reply(t('commands:music.noQueue'))
    let player = this.client.player.get(message.guild.id)
    let embed = new RichEmbed().setAuthor(`Fila de ${message.guild.name}`, message.guild.iconURL).setColor('#9dffe0')
    player.queue.forEach((track, i) => embed.addField(`${i + 1} – ${track.info.title}`, mss(track.info.length)))
    message.channel.send(embed)
  }
}

export default QueueCommand
