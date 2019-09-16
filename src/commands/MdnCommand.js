import Command from '../structures/Command'
import Torn from 'turndown'
import fetch from 'node-fetch'
import { RichEmbed } from 'discord.js'

class MdnCommand extends Command {
  constructor () {
    super('mdn')
    this.name = 'MDN'
    this.category = 'Utils'
    this.usage = '<query>'
  }
  async run (message, args, { t }) {
    if (!args[0]) return message.reply(t('commands:mdn.noArgs'))
    const res = await fetch(`https://mdn.pleb.xyz/search?q=${args.join(' ')}`)
    const body = await res.json()
    if (!body.Title || !body.Summary || !body.URL) return message.reply(t('commands:mdn.notFound', { search: args.join(' ') }))
    const summary = body.Summary.replace(/<code><strong>(.+)<\/strong><\/code>/g, '<strong><code>$1<\/code><\/strong>') //eslint-disable-line
    const turndown = new Torn()
    const embed = new RichEmbed()
      .setTitle(body.Title)
      .setURL(`https://developer.mozilla.org${body.URL}`)
      .setDescription(turndown.turndown(summary))
      .setAuthor('Mozilla Developers Network', 'https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png')
      .setColor('#000000')
    message.channel.send(embed)
  }
}

export default MdnCommand
