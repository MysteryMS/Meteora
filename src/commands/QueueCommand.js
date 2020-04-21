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
    this.botPermissions = ['ADD_REACTIONS']
    this.usage = 'music'
  }

  async run (message, args, server, { t }) {
    if (!this.client.lavalinkManager.manager.players.has(message.guild.id) || this.client.player.get(message.guild.id).queue.length === 0) return message.reply(t('commands:music.noQueue'))
    if (args[0] === 'remove') {
      if (!args[1]) return this.explain(message)
      const player = this.client.player.get(message.guild.id)
      if (isNaN(parseInt(args[1]))) return message.reply(t('commands:music.nan'))
      if (args[1] < 1 || args[1] > player.queue.length) return message.reply('xota')
      message.channel.send(t('commands:music.removedQueue', { track: player.queue[args[1] - 1].info.title }))
      return player.queue.splice(args[1] - 1, 1)
    }
    const embed = new MessageEmbed().setAuthor(t('commands:music.queue', { guild: message.guild.name }), message.guild.iconURL()).setColor('#9dffe0')

    if (this.client.player.get(message.guild.id).player.playlist === true) {
      server.playlist.get(this.client.player.get(message.guild.id).player.playlistId).forEach((a, i) => {
        info.videoInfo(a).then(b => { embed.addField(`${i + 1} – b.title`, `${b.views} views`) })
        message.channel.send(embed)
      })
    }
    const player = this.client.player.get(message.guild.id)
    player.queue.forEach((track, i) => embed.addField(`${i + 1} – ${track.info.title}`, mss(track.info.length)))
    await message.channel.send(embed).then(async (msg) => {
      const filter = (reaction, user) => ['⏭️', '⏹️'].includes(reaction.emoji.name) && user.id === message.author.id
      const collector = msg.createReactionCollector(filter, { time: 20000 })
      await msg.react('⏭️')
      await msg.react('⏹️')
      collector.on('collect', r => {
        if (r.emoji.name === '⏭️') {
          player.skip()
          message.channel.send(t('commands:music.skipped'))
          msg.reactions.cache.get(r.emoji.name).users.remove(message.author.id)
        }
        if (r.emoji.name === '⏹️') {
          player.queue[0] = undefined
          player.player.stop()
          message.channel.send(t('commands:music.stop'))
          collector.stop()
          msg.reactions.removeAll()
        }
      })
      collector.on('end', () => {
        msg.reactions.removeAll()
      })
    })
  }
}

module.exports = QueueCommand
