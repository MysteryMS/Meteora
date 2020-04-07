const Command = require('../structures/Command')
const { MessageEmbed } = require('discord.js')
const pms = require('pretty-ms')

class SearchCommand extends Command {
  constructor () {
    super('search')
    this.aliases = ['pesquisar', 'procurar']
    this.name = 'Search'
    this.category = 'music'
  }

  async run (message, args, server, { t }) {
    if (!args) return message.reply(t('commands:search.noQuery'))
    const emojiMappings = {
      1: '1️⃣',
      2: '2️⃣',
      3: '3️⃣',
      4: '4️⃣',
      5: '5️⃣',
      6: '6️⃣',
      7: '7️⃣',
      8: '8️⃣',
      9: '9️⃣'
    }
    this.client.lavalinkManager.search(args.join(' ')).then(async response => {
      if (!message.member.voice.channel) return message.reply(t('commands:music.noVoiceChannel'))
      await message.channel.send(new MessageEmbed()
        .setTitle(t('commands:search.results', { query: args.join(' ') }))
        .setDescription(response.map((a, i) => `${emojiMappings[i + 1]} → ${a.info.title} **[${a.info.author}]** \`(${pms(a.info.length)})\`\n`).slice(0, 9))
        .setColor('#ff413f')
      )
      await message.reply(t('commands:search.sendNumber'))
      const filter = (m) => (m.author.id === message.author.id)
      const collector = message.channel.createMessageCollector(filter, { time: 15000 })
      collector.on('collect', async (m) => {
        if (isNaN(Number(m.content))) return
        if (Number(m.content) > 9 || Number(m.content) < 1) return message.reply(t('commands:search.invalidNumber'))
        if (this.client.player.has(message.guild.id)) {
          this.client.player.get(message.guild.id).play(response[m.content - 1].info.identifier).then(info => {
            if (!info) return message.reply(t('commands:music.noResults'))
            message.channel.send(t('commands:music.addQueue', { track: info.title, duration: pms(info.length) }))
          })
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
