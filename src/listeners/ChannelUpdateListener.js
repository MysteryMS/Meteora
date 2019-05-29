const EventListener = require('../structures/EventListener')
const guild = require('../../models/guild')

class ChannelUpdateListener extends EventListener {
  constructor () {
    super('channelUpdate')
  }
  async run (oldChannel, newChannel) {
    guild.findOne({ _id: newChannel.guild.id }, (err, database) => {
      if (err) console.log(err)
      if (newChannel.id === database.counterChannel && database.counterOn === true) {
        database.counterMessage = newChannel.topic
        database.save()
      }
    })
    if (this.client.lavalinkManager.manager.has(newChannel.guild.id)) {
      console.log('xuxa 2')
      if (newChannel.id === this.client.calls.get(newChannel.guild.id).player.channel) {
        console.log('xuxa meneghel 2')
        this.client.channels.get(this.client.calls.get(newChannel.guild.id).messageChannel).send('acabou a festa')
        this.client.calls.get(newChannel.guild.id).player.stop()
      }
    }
  }
}

module.exports = ChannelUpdateListener
