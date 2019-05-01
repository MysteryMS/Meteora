const Command = require("../structures/Command")

const {inspect} = require("util")
const {RichEmbed} = require("discord.js")

class EvalCommand extends Command {

  constructor() {
    super('eval')

    this.onlyOwner = true
    this.name = 'Eval'
    this.usage = '<código>'
    this.aliases = ['e']
    this.description = 'Executa um código'

  }

  async run(message, args) {
    const code = args.join(' ')
    if (!args[0]) return this.explain(message)
    try {
      const evaluated = await eval(code)

      message.channel.send(inspect(evaluated, {depth: 0}), {code: 'js'})
    } catch (err) {
      const embed = new RichEmbed()
        .setTitle("Um erro inesperado ocorreu enquanto o comando estava sendo executado!")
        .setDescription("```js\n" + err.stack + "```")
        .setColor("#FF0000")
        .setTimestamp(new Date())

      message.reply({embed})
    }
  }

}

module.exports = EvalCommand