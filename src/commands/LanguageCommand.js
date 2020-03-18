const Command = require('../structures/Command')
const guild = require('../../models/guild')
const { MessageEmbed } = require('discord.js')

class LanguageCommand extends Command {
  constructor () {
    super('language')
    this.aliases = ['lang']
    this.name = 'Language'
    this.description = 'Altere a linguagem do bot!'
    this.category = 'Gerenciamento do servidor'
  }

  async run (message, args, server, { t }) {
    guild.findOne({ _id: message.guild.id }, async (err, database) => {
      if (err) console.log(err)
      message.channel.send(new MessageEmbed()
        .setTitle(t('commands:language.title'))
        .setDescription(t('commands:language.description'))
        .addField(t('commands:language.portugueseField'), '​​​')
        .addField(t('commands:language.englishField'), '​​​')
        .setColor('#6832e3')
      ).then(async (msg) => {
        await msg.react('🇧🇷')
        await msg.react('🇺🇸')
        const collector = msg.createReactionCollector((r, u) => (r.emoji.name === '🇧🇷', '🇺🇸') && (u.id !== this.client.user.id && u.id === message.author.id))

        collector.on('collect', async r => {
          switch (r.emoji.name) {
            case '🇧🇷':
              await msg.edit(new MessageEmbed().setDescription('Agora irei falar em português!').setColor('#42f445'))
              await msg.reactions.removeAll()
              database.language = 'pt-BR'
              database.save()
              break

            case '🇺🇸':
              await msg.edit(new MessageEmbed().setDescription('Now I\'ll speak in English!').setColor('#db3939'))
              await msg.reactions.removeAll()
              database.language = 'en-US'
              database.save()
          }
        })
      })
    })
  }
}

module.exports = LanguageCommand
