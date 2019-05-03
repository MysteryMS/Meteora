const Command = require('../structures/Command')
const guild = require('../../models/guild')
const {RichEmbed} = require('discord.js')

class LanguageCommand extends Command {
  constructor() {
    super('language')
    this.aliases = ['lang']
  }
  async run(message, args, { t }) {
    guild.findOne({_id: message.guild.id}, function (err, database) {
      message.channel.send(new RichEmbed()
        .setTitle(t('commands:message.embed.langTitle'))
        .setDescription(t('commands:message.embed.langDescription'))
        .addField(t('commands:messages.embed.language.portugueseField'), "​​​")
      )
    })
  }
}

module.exports = LanguageCommand