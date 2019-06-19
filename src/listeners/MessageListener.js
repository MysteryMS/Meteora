const EventListener = require('../structures/EventListener')
const Guild = require('../../models/guild')

class MessageListener extends EventListener {
  constructor () {
    super('message')
  }

  run (message) {
    if (message.content.startsWith(`<@${this.client.user.id}`)) {
      Guild.findOne({ _id: message.guild.id }, (err, database) => {
        if (err) console.log(err)
        let t = this.client.localeManager.getT(database.language)
        message.channel.send(t('descriptions:misc.botPing', { user: message.author, prefix: database.prefix }))
      })
    }
    if (message.author.bot) {
      return
    }

    this.client.commands.forEach((command) => {
      if (command.handle(message)) {
      }
    })
    message.channel.stopTyping()
  }
}

module.exports = MessageListener
