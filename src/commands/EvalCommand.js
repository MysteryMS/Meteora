const Command = require('../structures/Command')

// eslint-disable-next-line no-unused-vars
const { inspect } = require('util')
// eslint-disable-next-line no-unused-vars
const { RichEmbed } = require('discord.js')

class EvalCommand extends Command {
  constructor () {
    super('eval')

    this.name = 'Eval'
    this.usage = '<código>'
    this.aliases = ['e']
    this.category = 'Dev'
    this.description = 'Executa um código'
  }

  async run (message, args) {
    const Discord = require('discord.js')
    // eslint-disable-next-line no-unused-vars
    const parse = require('parse-duration')
    // eslint-disable-next-line no-unused-vars
    const moment = require('moment')
    const client = new Discord.Client()
    if (!['268526982222970880', '485837271967465472'].includes(message.author.id)) {
      return message.reply('apenas' +
        ' o meu' +
        ' criador tem a permissão de executar este comando!')
    }
    const util = require('util')
    let code = args.join(' ')
    if (!code) return message.channel.send(`<:erro_tick:558836213554085908> **|** ${message.author}, não encontrei nenhum código.`)
    try {
      // eslint-disable-next-line no-eval
      let ev = eval(code)
      let str = util.inspect(ev, {
        depth: 1
      })
      str = `${str.replace(new RegExp(`${client.token}|${process.env.TOKEN}`, 'g'), 'undefined')}`
      if (str.length > 1800) {
        str = str.substr(0, 1800)
        str = str + '...'
      }
      message.channel.send(`\`\`\`js\n${str}\`\`\``)
    } catch (err) {
      message.react('513547906905800729')
      let errembed = new Discord.RichEmbed()
        .setTitle('Whoops 😭')
        .setDescription(`\`\`\`js\n${err}\`\`\``)
        .setColor('#ff0200')

      message.channel.send(errembed)
    }
  }
}

module.exports = EvalCommand
