const Command = require('../structures/Command')

class ClearCommand extends Command {
  constructor() {
    super('clear')
    this.description = 'Deleta um número específico de mensagens no canal'
    this.name = 'Clear'
    this.usage = '<quantia>'
    this.aliases = ['delete', 'limpar']
    this.memberPermissions = ['MANAGE_MESSAGES']
    this.botPermissions = ['MANAGE_MESSAGES']
  }
  async run(message, args) {
    const deleteCount = parseInt(args[0], 10)
    if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
      return message.reply('por favor forneça um número entre 2 e 100' +
        ' equivalente ao número de mensagens a serem excluídas.')
    }
    const fetched = await message.channel.fetchMessages({ limit: deleteCount + 1 })
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`ERROR <:error:513734399762628609> **${error}**`))
    return message.channel.send('<a:selena:529838831147417620>').then(done => {
      done.delete(1000)
    })
  }
}

module.exports = ClearCommand