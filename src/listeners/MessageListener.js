const EventListener = require('../structures/EventListener')
const Guild = require('../../models/guild')

class MessageListener extends EventListener {
  constructor () {
    super('message')
  }

  run (message) {   
      if (message.content.startsWith(`<@${this.client.user.id}` || '<@!464304679128530954>')) {
        Guild.findOne({ _id: message.guild.id }, (err, database) => {
        let t = this.client.localeManager.getT(database.language)
        message.reply(t('descriptions:misc.botPing'))
        })
      }
      if (message.author.bot) {
        return
      }

      this.client.commands.forEach((command) => {
        if (command.handle(message)) {
        }
      })
      Guild.findOne({ _id: message.guild.id }, function (err, database) {
        if (!database) {
          new Guild({
            _id: message.guild.id,
            name: message.guild.name,
            counterOn: false,
            counterChannel: null,
            counterMessage: null,
            wMessage: false,
            wMessageMessage: null,
            wMessageChannel: null,
            leaveMessage: false,
            leaveMessageMessage: null,
            leaveMessageChannel: null,
            language: 'pt-BR',
            prefix: 'r>>'
          }).save()
        }
        if (err) return console.log(err)
      })
      message.channel.stopTyping()
  }
}

module.exports = MessageListener
