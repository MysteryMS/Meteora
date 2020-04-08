const Command = require('../structures/Command')
const { MessageEmbed } = require('discord.js')

class LanguageCommand extends Command {
  constructor () {
    super('language')
    this.aliases = ['lang', 'idioma']
    this.name = 'Language'
    this.description = 'Altere a linguagem do bot!'
    this.category = 'server'
    this.memberPermissions = ['MANAGE_GUILD']
    this.usage = 'language'
  }

  async run (message, args, server, { t }) {
    message.channel.send(new MessageEmbed()
      .setTitle(t('commands:language.title'))
      .setDescription(t('commands:language.description'))
      .addField(t('commands:language.portugueseField'), '​​​')
      .addField(t('commands:language.englishField'), '​​​')
      .setColor('#6832e3')
    ).then(async (msg) => {
      await msg.react('🇧🇷')
      await msg.react('🇺🇸')
      const collector = msg.createReactionCollector((r, u) => (['🇧🇷', '🇺🇸'].includes(r.emoji.name)) && (u.id !== this.client.user.id && u.id === message.author.id))

      collector.on('collect', async r => {
        switch (r.emoji.name) {
          case '🇧🇷':
            await msg.edit('🇧🇷 Falando em português! De volta ao meu país de origem.')
            await msg.suppressEmbeds()
            await msg.reactions.removeAll()
            server.language = 'pt-BR'
            server.save()
            break

          case '🇺🇸':
            await msg.edit('🇺🇸 Speaking in English! Isn\'t it cool?')
            await msg.suppressEmbeds()
            await msg.reactions.removeAll()
            server.language = 'en-US'
            server.save()
        }
      })
    })
  }
}

module.exports = LanguageCommand
