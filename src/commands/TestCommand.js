const Command = require('../structures/Command')

class TestCommand extends Command {
  constructor() {
    super('test')
    this.aliases = ['teste']
  }
  async run(message, args, { t }) {
    message.channel.send(t('commands:test.testing'))
  }
}

module.exports = TestCommand