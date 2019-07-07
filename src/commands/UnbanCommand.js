const Command = require('../structures/Command')

class UnbanCommand extends Command {
  constructor () {
    super('unban')
    this.name = 'Unban'
    this.category = 'Gerenciamento do servidor'
    this.aliases = ['revokeban', 'desbanir', 'desban']
    this.memberPermissions = ['BAN_MEMBERS']
    this.botPermissions = ['BAN_MEMBERS']
  }
  async run (message, args, { t }) {
    if (!this.client.fetchUser(args[0])) return message.reply(t('commands:user.invalidUser'))
    await message.guild.unban(args[0]).then(user => message.channel.send(t('commands:unban.message', { user: user.tag, id: user.id, author: message.author.toString() }))).catch(err => message.reply(t('commands:unban.error')))
  }
}

module.exports = UnbanCommand
