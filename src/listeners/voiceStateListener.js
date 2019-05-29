const EventListener = require('../structures/EventListener')

class voiceStateListener extends EventListener {
  constructor () {
    super('voiceStateUpdate')
  }

  async run (oldMember, newMember) {
    if (this.client.lavalinkManager.manager.has(oldMember.guild.id)) {
      console.log('xuxa 2')
      if (oldMember.voiceChannel.id === this.client.calls.get(oldMember.guild.id).player.channel) {
        console.log('xuxa meneghel 2')
        if (newMember.voiceChannel.members.size === 1) {
          console.log('xuxa 3')
        }
        this.client.channels.get(this.client.calls.get(oldMember.guild.id).messageChannel).send('acabou a festa')
        // this.client.calls.get(oldMember.guild.id).player.stop()
      }
    }
  }
}

module.exports = voiceStateListener
