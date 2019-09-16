import Command from '../structures/Command'
import { RichEmbed } from 'discord.js'

class RequestCommand extends Command {
  constructor () {
    super('request')
    this.name = 'Request'
    this.usage = '<code>'
    this.category = 'Util'
  }
  async run (message, args, { t }) {
    if (!args[0]) return this.explain()
    let codes = ['100', '101', '200', '201', '202', '204', '206', '300', '301', '302', '303', '304', '307', '400', '401', '402', '403', '404', '405', '406', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '420', '421', '422', '423', '424', '425', '426', '429', '431', '444', '450', '451', '500', '502', '503', '504', '506', '507', '508', '509', '510', '599']
    let embed = new RichEmbed()

    if (codes.includes(args[0])) embed.setTitle(t(`codes:${args[0]}.title`) && embed.setDescription(t(`codes:${args[0]}.description`)) && embed.setImage(t(`codes:${args[0]}.url`)) && embed.setColor('#000000') && embed.setTitle(t(`codes:${args[0]}.title`)) && message.channel.send(embed))
    else {
      message.reply(`O código \`${args[0]}\` não existe!`)
    }
  }
}

export default RequestCommand
