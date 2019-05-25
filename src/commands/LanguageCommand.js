const Command = require('../structures/Command')
const guild = require('../../models/guild')
const { RichEmbed } = require('discord.js')

class LanguageCommand extends Command {
  constructor () {
    super('language')
    this.aliases = ['lang']
  }
  async run (message, args, { t }) {
    guild.findOne({ _id: message.guild.id }, async (err, database) => {
      if (err) console.log(err)
      message.channel.send(new RichEmbed()
        .setTitle(t('commands:language.title'))
        .setDescription(t('commands:language.description'))
        .addField(t('commands:language.portugueseField'), '​​​')
        .addField(t('commands:language.englishField'), '​​​')
        .setColor('#6832e3')
      ).then(async (msg) => {
        await msg.react('🇧:regional_indicator_r:')
        await msg.react('🇺:regional_indicator_s:')
        const collector = msg.createReactionCollector((r, u) => (r.emoji.name === '🇧:regional_indicator_r:', '🇺:regional_indicator_s:') && (u.id !== this.client.user.id && u.id === message.author.id))

        collector.on('collect', async r => {
          switch (r.emoji.name) {
            case '🇧:regional_indicator_r:':
              await msg.edit(new RichEmbed().setDescription('Agora vou falar em português!').setColor('#42f445'))
              database.language = 'pt-BR'
              database.save()
              break

            case '🇺:regional_indicator_s:':
              await msg.edit(new RichEmbed().setDescription('Now I\'ll speak english!').setColor('#db3939'))
              database.language = 'en-US'
          }
        })
      })
    })
  }
}
module.exports = LanguageCommand
