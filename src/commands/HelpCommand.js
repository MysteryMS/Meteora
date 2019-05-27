const Command = require('../structures/Command')
const { RichEmbed } = require('discord.js')

class HelpCommand extends Command {
  constructor () {
    super('help')
    this.name = 'Help'
    this.description = 'Comando de ajuda do bot!'
    this.category = 'Utils'
    this.aliases = ['ajuda']
  }

  async run (message, args) {
    let music = new RichEmbed()
    let util = new RichEmbed()
    let dev = new RichEmbed()
    let serverm = new RichEmbed()
    this.client.commands.filter(c => c.category === 'Utils').forEach(a => util.setTitle('Categoria: Utils') && util.addField(a.name, a.description) && util.setColor('#ffa730') && util.setFooter('Use 🤷 como argumento de um comando para mais ajuda!'))
    this.client.commands.filter(c => c.category === 'Música').forEach(a => music.setTitle('Categoria: Música') && music.addField(a.name, a.description) && music.setColor('#4fa1ff') && music.setFooter('Use 🤷 como argumento de um comando para mais ajuda!'))
    this.client.commands.filter(c => c.category === 'Dev').forEach(a => dev.setTitle('Categoria: Dev') && dev.addField(a.name, a.description) && dev.setColor('#ff4648') && dev.setFooter('Use 🤷 como argumento de um comando para mais ajuda!'))
    this.client.commands.filter(c => c.category === 'Gerenciamento do' +
      ' servidor').forEach(a => serverm.setTitle('Categoria: Gerenciamento' +
      ' do servidor') && serverm.addField(a.name, a.description) && serverm.setColor('#3eff92') && serverm.setFooter('Use 🤷 como argumento de um comando para mais ajuda!'))
    await message.author.send(util)
    await message.author.send(dev)
    await message.author.send(serverm)
    await message.author.send(music)
    message.reply('Verifique suas mensagens diretas!')
  }
}

module.exports = HelpCommand
