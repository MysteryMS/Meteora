import Command from '../structures/Command'

class KickCommand extends Command {
  constructor () {
    super('kick')
    this.description = 'Expulse um membro do servidor.'
    this.name = 'Kick'
    this.usage = '<@usuário/id> [razão]'
    this.aliases = ['expulsar']
    this.category = 'Gerenciamento do servidor'
    this.memberPermissions = ['KICK_MEMBERS']
    this.botPermissions = ['KICK_MEMBERS']
  }

  async run (message, args, { t }) {
    let member = message.guild.members.get(args[0]) || message.mentions.members.first()
    if (!member) {
      return message.reply(t('commands:messages.noUserMention'))
    }
    if (!member.kickable) {
      return message.reply(t('commands:kick.cantKick'))
    }
    if (message.member.highestRole.comparePositionTo(member.highestRole) < 0) {
      message.reply(t('commands:kick.justCant'))
      return
    }

    args.shift()
    const reason = args.length !== 0 ? args.join(' ') : t('commands:kick.noReason')

    await member.kick(reason)

    return message.channel.send(t('commands:kick.message', { user: member.toString(), id: member.user.id, kickedBy: message.member.toString(), reason: reason, tag: member.user.tag }))
  }
}

export default KickCommand
