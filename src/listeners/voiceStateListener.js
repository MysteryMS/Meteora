const EventListener = require('../structures/EventListener')
const guild = require('../../models/guild')

class voiceStateListener extends EventListener {
  constructor () {
    super('voiceStateUpdate')
  }

  async run (oldMember, newMember) {
    const xuxa = await guild.findOne({ _id: oldMember.guild.id })
    let t = this.client.localeManager.getT(xuxa.language)
    if (this.client.lavalinkManager.manager.has(oldMember.guild.id)) {
      if (oldMember.voiceChannel.id === this.client.player.get(oldMember.guild.id).player.channel) {
        if (oldMember.guild.channels.get(oldMember.voiceChannel.id).members.size === 1) {
          this.client.channels.get(this.client.player.get(oldMember.guild.id).messageChannel).send(t('descriptions:structures.allMembersLeft', { channel: oldMember.voiceChannel.name }))
          await this.client.lavalinkManager.manager.leave(oldMember.guild.id)
          this.client.lavalinkManager.manager.delete(oldMember.guild.id)
        }
      }
    }
  }
}

module.exports = voiceStateListener
