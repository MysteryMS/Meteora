const Command = require('../structures/Command')

const { inspect } = require('util')
const { MessageEmbed } = require('discord.js')

class EvalCommand extends Command {
  constructor () {
    super('eval', ['evaluate'])
    this.name = 'Eval'
  }

  async run (message, args) {
    if (!['268526982222970880', '485837271967465472', '375627393773207554'].includes(message.author.id)) return
    const code = args.join(' ')

    try {
      // eslint-disable-next-line no-eval
      const evaluated = await Promise.resolve(eval(code))

      message.channel.send(inspect(evaluated, { depth: 0 }), { code: 'js' })
    } catch (err) {
      const embed = new MessageEmbed()
        .setTitle('Something went wrong.')
        .setDescription('```' + err.stack + '```')
        .setColor('#c62b1d')
        .setTimestamp(new Date())

      message.channel.send({ embed })
    }
  }
}

module.exports = EvalCommand
