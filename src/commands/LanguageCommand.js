const Command = require('../structures/Command')
const guild = require('../../models/guild')

class LanguageCommand extends Command {
  constructor() {
    super('language')
    this.aliases = ['lang']
  }
  async run(message, args, { t }) {
    guild.findOne({_id: message.guild.id}, function (err, database) {
      database.language = args[0]
      database.save().then(message.reply(t('commands:messages.langChanged', {language: args[0]})))
    })
  }
}

module.exports = LanguageCommand