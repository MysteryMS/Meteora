const Command = require('../structures/Command')
const pms = require('pretty-ms')

class SearchCommand extends Command {
  constructor () {
    super('search')
    this.aliases = ['pesquisar', 'procurar']
    this.name = 'Search'
    this.category = 'music'
    this.usage = 'search'
  }

  async run (message, args, server, { t }) {
    if (!args[0]) return this.explain(message)
    this.client.lavalinkManager.search(args.join(' ')).then(async response => {
      if (!message.member.voice.channel) return message.reply(t('commands:music.noVoiceChannel'))
      const tracks = response.map((t, i) => `**${i + 1}.** \`${t.info.title}\` **[${t.info.author}]** (${pms(t.info.length)})\n`)
      await message.channel.send(`${t('commands:search.results', { query: args.join(' ') })}\n\n ${tracks.slice(0, 10).join(' ')}\n ${t('commands:search.sendNumber')}`)
      const filter = (m) => (m.author.id === message.author.id)
      const collector = message.channel.createMessageCollector(filter, { time: 18000 })
      collector.on('collect', async (m) => {
        if (isNaN(Number(m.content))) return
        if (Number(m.content) > 10 || Number(m.content) < 1) return message.reply(t('commands:search.invalidNumber'))
        if (this.client.player.has(message.guild.id)) {
          this.client.player.get(message.guild.id).play(response[m.content - 1].info.identifier).then(info => {
            message.channel.send(t('commands:music.addQueue', { track: info.title, duration: pms(info.length) }))
          })
          return collector.stop()
        }
        const player = await this.client.lavalinkManager.join(message.member.voice.channelID)
        player.channel = message.channel
        player.play(response[m.content - 1].info.identifier)
        collector.stop()
        this.client.player.set(message.guild.id, player)
      })
    })
  }
}

module.exports = SearchCommand
