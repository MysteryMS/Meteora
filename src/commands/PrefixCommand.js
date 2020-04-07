const Command = require('../structures/Command')

class PrefixCommand extends Command {
  constructor () {
    super('prefix')
    this.name = 'Prefix'
    this.category = 'server'
    this.memberPermissions = ['MANAGE_SERVER']
  }

  async run (message, args, server, { t }) {
    if (!args.length) return message.reply(t('commands:prefix.noArgs'))
    if (args[0].split('').length >= 4) return message.reply(t('commands:prefix.maxLength'))
    server.prefix = args[0]
    server.save().then(message.reply(t('commands:prefix.changed', { prefix: args[0] })))
  }
}

module.exports = PrefixCommand
