const Command = require('../structures/Command')
const { RichEmbed } = require('discord.js')

class InviteCommnd extends Command {
  constructor () {
    super('invite')
    this.name = 'Invite'
    this.category = 'Utils'
    this.aliases = ['convite']
  }
  async run (message, args, { t }) {
    message.channel.send(new RichEmbed().setDescription(t('commands:inviteMessage', { link: 'https://discordapp.com/api/oauth2/authorize?client_id=464304679128530954&permissions=8&scope=bot' })).setColor('#f95aff'))
  }
}

module.exports = InviteCommnd
