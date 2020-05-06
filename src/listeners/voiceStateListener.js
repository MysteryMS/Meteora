const EventListener = require('../structures/EventListener')
const guild = require('../../models/guild')

class voiceStateListener extends EventListener {
  constructor () {
    super('voiceStateUpdate')
  }

  async run (oldState, newState) {
    const server = await guild.findOne({ _id: oldState.guild.id })
    const t = this.client.localeManager.getT(server.language)
    if (newState.id === this.client.user.id && newState.channelID === null) return this.client.lavalinkManager.manager.players.delete(newState.guild.id)
    if (oldState.guild.me.voice.channel) {
      if ((newState.channel || oldState.channel).members.size === 1) {
        if (oldState.channelID === this.client.lavalinkManager.manager.voiceStates.get((oldState.guild || newState.guild).id).channel_id) {
          this.client.player.get((oldState.guild || newState.guild).id).channel.send(t('descriptions:structures.allMembersLeft', { channel: oldState.channel.name }))
          await this.client.lavalinkManager.manager.leave(oldState.guild.id)
          this.client.lavalinkManager.manager.players.get(oldState.guild.id).destroy()
          this.client.player.delete(oldState.guild.id)
          this.client.lavalinkManager.manager.voiceServers.delete(oldState.guild.id)
        } else {
          await this.client.lavalinkManager.manager.leave(newState.guild.id)
        }
      }
    }
  }
}

module.exports = voiceStateListener
