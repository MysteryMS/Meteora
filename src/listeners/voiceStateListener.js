const EventListener = require('../structures/EventListener')

class voiceStateListener extends EventListener {
  constructor () {
    super('voiceStateUpdate')
  }

  async run (oldMember, newMember) {
    if (this.client.lavalinkManager.manager.has(oldMember.guild.id)) {
      if (oldMember.voiceChannel.id === this.client.calls.get(oldMember.guild.id).player.channel) {
        if (oldMember.guild.channels.get(oldMember.voiceChannel.id).members.size === 1) {
          this.client.channels.get(this.client.calls.get(oldMember.guild.id).messageChannel).send('acabou a festa')
          this.client.lavalinkManager.manager.leave()
        }
      }
    }
  }
}

module.exports = voiceStateListener
