const EventListener = require('../structures/EventListener')
const guild = require('../../models/guild')

class voiceStateListener extends EventListener {
  constructor () {
    super('voiceStateUpdate')
  }

  async run (oldState, newState) {
    const xuxa = await guild.findOne({ _id: oldState.guild.id })
    const t = this.client.localeManager.getT(xuxa.language)
    if (this.client.lavalinkManager.manager.players.has(oldState.guild.id)) {
      if (oldState.channelID === this.client.lavalinkManager.manager.voiceStates.get(oldState.guild.id).channel_id) {
        if (oldState.channel.members.size === 1) {
          this.client.channels.cache.get(this.client.player.get(oldState.guild.id).messageChannel).send(t('descriptions:structures.allMembersLeft', { channel: oldState.channel.name }))
          await this.client.lavalinkManager.manager.leave(oldState.guild.id)
          this.client.lavalinkManager.manager.players.delete(oldState.guild.id)
          this.client.player.delete(oldState.guild.id)
          this.client.lavalinkManager.manager.voiceServers.delete(oldState.guild.id)
        }
      }
    }
    if (oldState.member.id === '464304679128530954') {
      // this.client.lavalinkManager.manager.players.delete(oldState.guild.id)
      // this.client.player.delete(oldState.guild.id)
      // this.client.lavalinkManager.manager.voiceServers.delete(oldState.guild.id)
    }
  }
}

module.exports = voiceStateListener
