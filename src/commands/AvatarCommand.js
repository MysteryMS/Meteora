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
    const user = message.mentions.users.first() || this.client.users.get(args[0]) || message.author
    uEmbed.setImage(user.displayAvatarURL({ type: 'png' }))
    uEmbed.setAuthor('Avatar de ' + user.username)
    const url = user.displayAvatarURL({ type: 'png' })
    const { body } = await got(url, { encoding: null })
    const palette = await splashy(body)
    uEmbed.setColor(palette[0])
    uEmbed.setTimestamp()

    message.channel.send(uEmbed)
  }
}

module.exports = AvatarCommand
