const Command = require('../structures/Command')
const mss = require('pretty-ms')

class QueueCommand extends Command {
  constructor () {
    super('queue')
    this.name = 'Queue'
    this.category = 'music'
    this.aliases = ['fila', 'q']
    this.botPermissions = ['ADD_REACTIONS']
    this.usage = 'queue'
  }

  async run (message, args, server, { t }) {
    if (!this.client.lavalinkManager.manager.players.get(message.guild.id)) return message.reply(t('commands:music.notPlaying'))
    if (args[0] === 'remove') {
      if (!args[1]) return this.explain(message)
      const player = this.client.player.get(message.guild.id)
      if (isNaN(parseInt(args[1]))) return message.reply(t('commands:music.nan'))
      if (args[1] < 1 || args[1] > player.queue.length) return message.reply('xota')
      message.channel.send(t('commands:music.removedQueue', { track: player.queue[args[1] - 1].info.title }))
      return player.queue.splice(args[1] - 1, 1)
    }
    const player = this.client.player.get(message.guild.id)
    const map = player.queue.map((track, i) => `${i + 1}. ${track.info.title} (${mss(track.info.length)})\n`)

    await message.channel.send(t('commands:queue.message', { title: player.nowPlaying.info.title, length: mss(player.nowPlaying.info.length), tracks: map.join('') }), { code: 'md' }).then(async (msg) => {
      const filter = (reaction, user) => ['⏭️', '⏹️'].includes(reaction.emoji.name) && user.id === message.author.id
      const collector = msg.createReactionCollector(filter, { time: 20000 })
      await msg.react('⏭️')
      await msg.react('⏹️')
      collector.on('collect', r => {
        if (r.emoji.name === '⏭️') {
          const newMusic = player.queue[0]
          player.skip()
          message.channel.send(t('commands:music.skipped'))
          msg.reactions.cache.get(r.emoji.name).users.remove(message.author.id)
          if (!this.client.player.get(message.guild.id).queue) return msg.delete()
          const newMap = player.queue.map((track, i) => `${i + 1}. ${track.info.title} (${mss(track.info.length)})\n`)
          msg.edit(t('commands:queue.message', { title: newMusic.info.title, length: mss(newMusic.info.length), tracks: newMap.join('') }), { code: 'md' })
        }
        if (r.emoji.name === '⏹️') {
          player.queue[0] = undefined
          player.player.stop()
          msg.delete()
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
