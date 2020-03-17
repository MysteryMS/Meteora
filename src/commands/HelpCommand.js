const Command = require('../structures/Command')
const { MessagEmbed } = require('discord.js')

class HelpCommand extends Command {
  constructor () {
    super('help')
    this.name = 'Help'
    this.description = 'Comando de ajuda do bot!'
    this.category = 'Utils'
    this.aliases = ['ajuda']
  }

  async run (message, args, server, { t }) {
    const music = new MessagEmbed()
    const util = new MessagEmbed()
    const dev = new MessagEmbed()
    const serverm = new MessagEmbed()
    this.client.commands.filter(c => c.category === 'Utils').forEach(a => util.setTitle(t('descriptions:helpEmbed.utilsCateg')) && util.addField(a.name, t(`descriptions:descriptions.${a.label}`)) && util.setColor('#ffa730') && util.setFooter(t('descriptions:helpEmbed.argsFooter')))

    this.client.commands.filter(c => c.category === 'Música').forEach(a => music.setTitle(t('descriptions:helpEmbed.musicCateg')) && music.addField(a.name, t(`descriptions:descriptions.${a.label}`)) && music.setColor('#4fa1ff') && music.setFooter(t('descriptions:helpEmbed.argsFooter')))

    this.client.commands.filter(c => c.category === 'Dev').forEach(a => dev.setTitle(t('descriptions:helpEmbed.devCateg')) && dev.addField(a.name, t(`descriptions:descriptions.${a.label}`)) && dev.setColor('#ff4648') && dev.setFooter(t('descriptions:helpEmbed.argsFooter')))

    this.client.commands.filter(c => c.category === 'Gerenciamento do' +
      ' servidor').forEach(a => serverm.setTitle(t('descriptions:helpEmbed.serverManagCateg')) && serverm.addField(a.name, t(`descriptions:descriptions.${a.label}`)) && serverm.setColor('#3eff92') && serverm.setFooter(t('descriptions:helpEmbed.argsFooter')))

    await message.author.send(util).catch(err => message.reply(t('commands:messages.cantDm')) && console.log(err))
    await message.author.send(dev)
    await message.author.send(serverm)
    await message.author.send(music)
    await message.author.send(t('descriptions:helpEmbed.invite'))
    await message.reply(t('commands:messages.checkDm'))
  }
}

module.exports = HelpCommand
