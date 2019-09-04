const Command = require('../structures/Command')

class BanCommand extends Command {
  constructor () {
    super('ban')
    this.usage = '@usuário [motivo]'
    this.aliases = ['banir']
    this.name = 'Ban'
    this.category = 'Gerenciamento do servidor'
    this.description = 'Bana um usuário do seu servidor!'
    this.memberPermissions = ['BAN_MEMBERS']
    this.botPermissions = ['BAN_MEMBERS']
  }

  async run (message, args, { t }) {
    if (args.length === 0) {
      this.explain(message)
      return
    }

    const user = message.mentions.users.first() || await this.client.fetchUser(args[0])

    if (!user) {
      await message.reply(t('commands:messages.invalidUser'))
      return
    }

    const member = message.guild.member(user)

    if (member) {
      if (!member.bannable) {
        await message.reply(t('commands:ban.cantBan'))
        return
      }

      if (message.member.highestRole.comparePositionTo(member.highestRole) < 0) {
        await message.reply(t('commands:ban.justCant'))
        return
      }
    }

    args.shift()
    const reason = args.length !== 0 ? args.join(' ') : t('commands:ban.noReason')

    await message.guild.ban(user, { reason: t('commands:ban.audit', { user: message.author.tag, reason: reason }) })
    message.channel.send(t('commands:ban.message', { user: member.toString(), id: member.user.id, kickedBy: message.member.toString(), reason: reason, tag: member.user.tag }))
  }
}

module.exports = BanCommand
