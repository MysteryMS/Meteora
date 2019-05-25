const Command = require('../structures/Command')
const guild = require('../../models/guild')

class CounterCommand extends Command {
  constructor () {
    super('counter')
    this.name = 'Counter'
    this.description = 'Exibe o número de membros do seu servidor no' +
      ' tópico de um canal'
    this.aliases = ['contador']
    this.usage = 'nao ta pronto'
    this.memberPermissions = ['ADMINISTRATOR']
    this.botPermissions = ['MANAGE_CHANNELS']
  }

  async run (message, args, { t }) {
    switch (args[0]) {
      case 'enable':
        guild.findOne({ _id: message.guild.id }, async function (err, database) {
          if (err) console.log(err)
          if (database.counterChannel === null) {
            if (!args[1]) { // TODO > Traduções para o counter
              return message.reply(t('commands:counter.firstTimeID'))
            }
            if (!message.guild.channels.get(args[1])) return message.reply(t('commands:counter.invalidChannel'))

            database.counterChannel = args[1]
            database.counterOn = true
            database.counterMessage = this.client.channels.get(args[1]).topic
            database.save()
            message.reply(t('commands:counter.firstActive', { channel: args[1] }))
          } else if (database.counterOn === false) {
            database.counterOn = true
            database.save()
              .then(message.reply(t('commands:counter.activated')))
          }
        })
        break

      case 'disable':
        guild.findOne({ _id: message.guild.id }, async function (err, database) {
          if (err) console.log(err)
          if (database.counterChannel === null) {
            return message.reply(t('commands:counter.firstTimeDeactivating'))
          } else if (database.counterOn === true) {
            database.counterOn = false
            database.save()
            message.reply(t('commands:counter.deactivated'))
          }
        })
        break

      case 'change-channel':
        guild.findOne({ _id: message.guild.id }, function (err, database) {
          if (err) console.log(err)
          if (database.counterChannel === null) {
            return message.reply(t('commands:firstTimeChangingChannel'))
          }

          if (!message.guild.channels.get(args[1])) return message.reply(t('commands:counter.invalidChannel'))
          database.counterChannel = args[1]
          database.counterMessage = this.client.channels.get(args[1]).topic
          database.save().then(() => message.reply(t('commands:counter.channelChanged')))
        })
    }
  }
}

module.exports = CounterCommand
