const Command = require('../structures/Command')
const guild = require('../../models/guild')
const {RichEmbed} = require('discord.js')

class LanguageCommand extends Command {
  constructor() {
    super('language')
    this.aliases = ['lang']
  }
  async run(message, args, { t }) {
    guild.findOne({_id: message.guild.id}, (err, database) => {
      message.channel.send(new RichEmbed()
        .setTitle(t('commands:language.title'))
        .setDescription(t('commands:language.description'))
        .addField(t('commands:language.portugueseField'), "​​​")
        .addField(t('commands:language.englishField'), "​​​")
      )
    })
  }
}

module.exports = LanguageCommand