const Command = require('../structures/Command')

class PingCommand extends Command {
  constructor () {
    super('ping')
    this.aliases = ['pong']
    this.name = 'Ping'
    this.description = 'Tempo de resposta do cliente'
    this.category = 'Utils'
  }

  run (message, args) {
    message.reply(`**Pong!** :ping_pong: \`${message.client.ping}ms\``)
  }
}

module.exports = PingCommand
