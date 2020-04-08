const Command = require('../structures/Command')
const { MessageEmbed } = require('discord.js')

class HelpCommand extends Command {
  constructor () {
    super('help')
    this.name = 'Help'
    this.description = 'Comando de ajuda do bot!'
    this.category = 'util'
    this.aliases = ['ajuda']
  }

  async run (message, args, server, { t }) {
    const embed = new MessageEmbed()
      .addField(`${t('descriptions:helpEmbed.utilsCateg')} (${this.getCommandSize('util', this)})`, this.getCategory('util', server.prefix, this))
      .addField(`${t('descriptions:helpEmbed.musicCateg')} (${this.getCommandSize('music', this)})`, this.getCategory('music', server.prefix, this))
      .addField(`${t('descriptions:helpEmbed.botCateg')} (${this.getCommandSize('server')})`, this.getCategory('server', server.prefix))
      .addField(`Beta (${this.getCommandSize('beta')})`, this.getCategory('beta', server.prefix))
      .setColor('#de3368')
      .setAuthor(t('descriptions:helpEmbed.author', { user: message.author.username }), message.author.displayAvatarURL())
    await message.author.send(embed).catch(() => message.channel.send(t('commands:messages.cantDm')))
    await message.author.send(t('descriptions:helpEmbed.invite'))
    await message.reply(t('commands:messages.checkDm'))
  }

  getCommandSize (category) {
    return this.client.commands.filter(c => c.category === category).length
  }

  getCategory (category, prefix) {
    return this.client.commands.filter(c => c.category === category).map(c => `\`${prefix}${c.label}\``).join(', ')
  }
}

module.exports = HelpCommand
