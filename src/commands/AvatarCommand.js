const splashy = require('splashy')
const got = require('got')
const { MessageEmbed } = require('discord.js')
const Command = require('../structures/Command')

class AvatarCommand extends Command {
  constructor () {
    super('avatar')
    this.name = 'Avatar'
    this.description = 'Veja o avatar de qualquer pessoa!'
    this.usage = '<@usuário/id>'
    this.catrgory = 'Utils'
    this.aliases = ['pfp']
  }

  async run (message, args) {
    const uEmbed = new MessageEmbed()
    const user = message.mentions.users.first() || this.client.users.cache.get(args[0]) || message.author
    uEmbed.setImage(user.displayAvatarURL({ format: 'png' }))
    uEmbed.setAuthor('Avatar de ' + user.username)
    const url = user.displayAvatarURL({ format: 'png' })
    const { body } = await got(url, { encoding: null })
    const palette = await splashy(body)
    uEmbed.setColor(palette[0])
    uEmbed.setTimestamp()

    message.channel.send(uEmbed)
  }
}

module.exports = AvatarCommand
