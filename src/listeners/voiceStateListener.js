const EventListener = require('../structures/EventListener')
const guild = require('../../models/guild')

class voiceStateListener extends EventListener {
  constructor () {
    super('voiceStateUpdate')
  }

  async run (oldMember, newMember) {
    const xuxa = await guild.findOne({ _id: oldMember.guild.id })
    const t = this.client.localeManager.getT(xuxa.language)
    if (this.client.lavalinkManager.manager.players.has(oldMember.guild.id)) {
      if (oldMember.voice.channelID === this.client.player.get(oldMember.guild.id).player.channel) {
        if (oldMember.guild.channels.cache.get(oldMember.voice.channelID).members.size === 1) {
          this.client.channels.get(this.client.player.get(oldMember.guild.id).messageChannel).send(t('descriptions:structures.allMembersLeft', { channel: oldMember.voice.channel.name }))
          await this.client.lavalinkManager.manager.leave(oldMember.guild.id)
          this.client.lavalinkManager.manager.delete(oldMember.guild.id)
        }
      }
    }
  }
}

module.exports = voiceStateListener
