import splashy from 'splashy'
import got from 'got'
import { RichEmbed } from 'discord.js'
import Command from '../structures/Command'

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
    let uEmbed = new RichEmbed()
    const user = message.mentions.users.first() || this.client.users.get(args[0]) || message.author
    uEmbed.setImage(user.displayAvatarURL)
    uEmbed.setAuthor('Avatar de ' + user.username)
    const url = user.displayAvatarURL
    const { body } = await got(url, { encoding: null })
    const palette = await splashy(body)
    uEmbed.setColor(palette[0])
    uEmbed.setTimestamp()

    message.channel.send(uEmbed)
  }
}

export default AvatarCommand
