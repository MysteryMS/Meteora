const Command = require('../structures/Command')

class PrefixCommand extends Command {
  constructor () {
    super('prefix')
    this.name = 'Prefix'
    this.category = 'server'
    this.memberPermissions = ['MANAGE_GUILD']
    this.usage = 'prefix'
  }

  async run (message, args, server, { t }) {
    if (!args[0]) return this.explain(message)
    if (args[0].split('').length >= 4) return message.reply(t('commands:prefix.maxLength'))
    server.prefix = args[0]
    server.save().then(message.reply(t('commands:prefix.changed', { prefix: args[0] })))
  }
}

module.exports = PrefixCommand
