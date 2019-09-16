import Command from '../structures/Command'
import { RichEmbed } from 'discord.js'

class DiscordCommand extends Command {
  constructor () {
    super('discord')
    this.description = 'Veja o status atual do Discord'
    this.name = 'Discord'
    this.category = 'Utils'
    this.aliases = ['discordstatus', 'dstts']
  }

  async run (message, args) {
    const st = require('striptags')
    let a = require('axios')
    let c = require('cheerio')
    a.get('https://status.discordapp.com/').then(res => {
      let $ = c.load(res.data)
      // console.log(res.data);
      let code = 'span.status'
      const status = new RichEmbed()
        .setTitle($('.actual-title').html() ? $('.actual-title').html() : 'Discord Status')
        .setURL('https://status.discordapp.com/')
        .setColor('RANDOM')
        .setDescription($(code).html() ? st($(code).html().trim('\n').trim(' ')) : st($('.updates').html().trim().trim('\n').slice(0, 2000)))

      message.channel.send(status)
    }).catch(e => {
      message.channel.send(e.stack)
    })
  }
}

export default DiscordCommand
