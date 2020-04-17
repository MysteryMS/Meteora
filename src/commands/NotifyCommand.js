const Command = require('../structures/Command')

class NotifyCommand extends Command {
  constructor () {
    super('notify', ['notificar'])
  }

  async run (message, args, server, { t }) {
    if (message.guild.id !== '693543229412343868') return
    if (message.member.roles.cache.has('693563639436804096')) {
      await message.member.roles.remove('693563639436804096')
      await message.reply('So you don\'t want to receive my updates? I see...')
    } else {
      await message.member.roles.add('693563639436804096')
      await message.reply('Thank you for subscribing to my updates!')
    }
  }
}

module.exports = NotifyCommand
