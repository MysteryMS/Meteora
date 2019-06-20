const Command = require('../structures/Command')

const { inspect } = require('util')
const { RichEmbed } = require('discord.js')

class EvalCommand extends Command {
  constructor () {
    super('eval', ['evaluate'])
    this.name = 'Eval'
    this.category = 'Dev'
    this.onlyOwner = true
  }

  async run (message, args) {
    const code = args.join(' ')

    try {
      // eslint-disable-next-line no-eval
      const evaluated = await eval(code)

      message.channel.send(inspect(evaluated, { depth: 0 }), { code: 'js' })
    } catch (err) {
      const embed = new RichEmbed()
        .setTitle('Whoopsie!')
        .setDescription('```' + err.stack + '```')
        .setColor('#FF0000')
        .setTimestamp(new Date())

      message.channel.send({ embed })
    }
  }
}

module.exports = EvalCommand
