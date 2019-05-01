const Command = require('../structures/Command')

class KickCommand extends Command {
  constructor() {
    super('kick')
    this.description = 'Expulse um membro do servidor.'
    this.name = 'Kick'
    this.usage = '<@usuário/id> [razão]'
    this.aliases = ['expulsar']
    this.memberPermissions = ['KICK_MEMBERS']
    this.botPermissions = ['KICK_MEMBERS']
  }

  async run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.get(args[0])
    const {RichEmbed} = require('discord.js')

    let member = message.guild.members.get(args[0]) || message.mentions.members.first()
    if (!member) {
      return message.reply('Marque um usuário ou seu ID para eu expulsar!')
    }
    if (!member.kickable) {
      return message.reply("Eu não consigo expulsar este usuário! Talvez os" +
        " meus" +
        " cargos estejam abaixo dos dele. :sob:")
    }

    let reason = args.slice(1).join(' ')
    if (!reason) reason = 'Nenhuma razão providenciada.'

    await member.kick(reason)

    const kickembed = new RichEmbed()
      .setTitle(`Membro ${member.user.tag} __expulso__!`)
      .setColor(0xc99462)
      .addField('**Razão:**', reason)
      .setThumbnail(`${user.user.displayAvatarURL}`)
      .setFooter(`Expulso por: ${message.author.tag}`, `${message.author.avatarURL}`)

    return message.channel.send(kickembed)
  }
}

module.exports = KickCommand