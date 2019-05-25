const EventListener = require('../structures/EventListener')
const Guild = require('../../models/guild')

class MessageListener extends EventListener {
  constructor () {
    super('message')
  }

  run (message) {
    if (message.author.bot) { return }

    this.client.commands.forEach((command) => {
      if (command.handle(message)) {}
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
          language: 'pt-BR'
        }).save()
      }
      if (err) return console.log(err)
    })
    message.channel.stopTyping()
  }
}

module.exports = MessageListener
