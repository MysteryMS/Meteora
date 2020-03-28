const Command = require('../structures/Command')
const { MessageEmbed } = require('discord.js')

class InviteCommnd extends Command {
  constructor () {
    super('invite')
    this.name = 'Invite'
    this.category = 'utils'
    this.aliases = ['convite']
  }

  async run (message, args, server, { t }) {
    message.channel.send(new MessageEmbed().setDescription(t('commands:inviteMessage', { link: 'https://discordapp.com/api/oauth2/authorize?client_id=464304679128530954&permissions=8&scope=bot' })).setColor('#f95aff'))
  }
}

module.exports = InviteCommnd
