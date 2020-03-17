const Command = require('../structures/Command')
const { MessagEmbed } = require('discord.js')

class InviteCommnd extends Command {
  constructor () {
    super('invite')
    this.name = 'Invite'
    this.category = 'Utils'
    this.aliases = ['convite']
  }

  async run (message, args, server, { t }) {
    message.channel.send(new MessagEmbed().setDescription(t('commands:inviteMessage', { link: 'https://discordapp.com/api/oauth2/authorize?client_id=464304679128530954&permissions=8&scope=bot' })).setColor('#f95aff'))
  }
}

module.exports = InviteCommnd
