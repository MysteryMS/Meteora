const Command = require('../structures/Command')
const guild = require('../../models/guild')

class CounterCommand extends Command {
  constructor() {
    super('counter')
    this.name = 'Counter'
    this.description = 'Exibe o número de membros no seu servidor no' +
      ' tópico de um canal'
    this.aliases = ['contador']
    this.usage = 'nao ta pronto'
    this.memberPermissions = ['ADMINISTRATOR']
    this.botPermissions = ['MANAGE_CHANNELS']
  }

  async run(message, args) {
    switch (args[0]) {
      case 'enable':
        guild.findOne({_id: message.guild.id}, async function (err, database) {
          if (database.counterChannel === null) {
            if (!args[1]) return message.reply("Você precisa" +
              " colocar" +
              " o ID do" +
              " canal quando estiver ativando pela primeira vez!")
            if (!message.guild.channels.get(args[1])) return message.reply("Não encontrei esse canal no servidor.")

            database.counterChannel = args[1]
            database.counterOn = true
            database.save()
            message.reply(`<a:selena:529838831147417620> Contador ativado em <#${args[1]}>`)

          } else if (database.counterOn === false) {
            database.counterOn = true
            database.save()
              .then(message.reply("<a:selena:529838831147417620> Contador" +
                " ativado"))
          }
        })
        break;

      case 'disable':
        guild.findOne({_id: message.guild.id}, async function (err, database) {
          if (database.counterChannel === null) {
            return message.reply("Você precisa ativar o" +
              " contador pela primeira vez antes de desativá-lo")

          } else if (database.counterOn === true) {
            database.counterOn = false
            database.save()
            message.reply("<a:selena:529838831147417620> Contador desativado")
          }
        })
        break;

      case 'change-channel':
        guild.findOne({_id: message.guild.id}, function (err, database) {
          if (database.counterChannel === null) return message.reply("Você" +
            " precisa" +
            " ativar o" +
            " contador pela primeira vez antes de trocar o canal!")

          if (!message.guild.channels.get(args[1])) return message.reply("Não encontrei esse canal no servidor.")
          database.counterChannel = args[1]
          database.save().then(() => message.reply(`Canal do contador alterado para <#${args[1]}>`))

        })
    }

  }
}

module.exports = CounterCommand