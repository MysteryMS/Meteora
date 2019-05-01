const Command = require('../structures/Command')

class PlayCommand extends Command {
  constructor() {
    super('play')
    this.name = 'Play'
    this.description = 'Toque uma música usando um link ou buscando-a'
    this.usage = '<link/nome>'
  }

  async run(message, args) {
    const mss = require('pretty-ms')
    if (!message.member.voiceChannel) return message.reply('Você precisa' +
      ' estar em um canal de voz para executar esse comando!')

    if (!args[0]) return message.reply("Você precisa indicar o nome da" +
      " música que quer que eu toque!")

    if (this.client.lavalinkManager.manager.has(message.guild.id)) {
      this.client.calls.get(message.guild.id).play(args.join(' ')).then(info => {
        message.channel.send(`<:queuemusic:571414423152099328> – \`${info.title}\` (${mss(info.length)}) adicionado à fila`)

      })
    } else {
      if (!message.member.voiceChannel) return message.reply('Você precisa' +
        ' estar em um canal de voz para executar esse comando!')
      if (!args[0]) {
        return message.reply("Você precisa indicar o nome da" +
          " música que quer que eu toque!")
      }
      let player = await this.client.lavalinkManager.join(message.member.voiceChannel.id)
      player.on('playingNow', track => {
        message.channel.send('<a:cd:521088033664270336> – Tocando Agora: `' + track.info.title + '`' + ` (${mss(track.info.length)})`)
        this.client.calls.get(message.guild.id).playingNow = track
      })
      player.play(args.join(' '))
      this.client.calls.set(message.guild.id, player)
    }
  }
}

module.exports = PlayCommand