const Command = require('../structures/Command')

class AEmojiCommand extends Command {
  constructor () {
    super('addemoji')
    this.description = 'Adicione um emoji no seu servidor a partir de uma URL'
    this.name = 'AddEmoji'
    this.aliases = ['createemoji', 'emoji']
    this.usage = '<link> <name>'
    this.category = 'Gerenciamento do servidor'
    this.memberPermissions = ['MANAGE_EMOJIS']
    this.clientPermissions = ['MANAGE_EMOJIS']
  }

  async run (message, args) {
    if (!args[0]) {
      return this.explain()
    }
    if (!args[1]) {
      return message.reply('Whoops, você esqueceu de colocar o' +
      ' nome do emoji!')
    }

    await message.guild.createEmoji(args[0], args.slice(1).join('_')).then(emoji => message.channel.send(`:${emoji.name}: **|** ${message.author} Emoji criado! `))
  }
}

module.exports = AEmojiCommand
