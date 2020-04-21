const Command = require('../structures/Command')

class PlaynowCommand extends Command {
  constructor () {
    super('playnow', ['pn', 'tocaragora'])
    this.name = 'Play Now'
    this.category = 'music'
    this.botPermissions = ['CONNECT', 'SPEAK']
    this.usage = 'playnow'
  }

  async run (message, args, server, { t }) {
    if (!args[0]) return this.explain(message)
    if (this.client.lavalinkManager.manager.players.has(message.guild.id)) {
      if (message.member.voice.channelID) return message.reply(t('commands:music.noVoiceChannel'))
      this.client.player.get(message.guild.id).playNow(args.join(' '))
    } else {
      if (!message.member.voice.channelID) return message.reply(t('commands:music.noVoiceChannel'))
      const player = await this.client.lavalinkManager.join(message.member.voice.channelID)
      player.channel = message.channel
      this.client.player.set(message.guild.id, player)
      player.play(args.join(' '))
    }
  }
}

module.exports = PlaynowCommand
