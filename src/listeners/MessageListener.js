const EventListener = require("../structures/EventListener")
const guild = require('../../models/guild')

class MessageListener extends EventListener {

  constructor () {
    super("message")
  }

  run(message) {
    if (message.author.bot)
      return

    this.client.commands.forEach((command) => {
      if (command.handle(message))
        return
    })
    guild.findOne({_id: message.guild.id}, function (err, database) {
      if (!database) {
        new guild({
          _id: message.guild.id,
          counterOn: false,
          counterChannel: null,
          counterMessage: null,
          wMessage: false,
          wMessageMessage: null,
          wMessageChannel: null,
          leaveMessage: false,
          leaveMessageMessage: null,
          leaveMessageChannel: null,
          language: "pt-BR"
        }).save()
      }
      if (err) return console.log(err)
    })
    message.channel.stopTyping()
  }
}

module.exports = MessageListener