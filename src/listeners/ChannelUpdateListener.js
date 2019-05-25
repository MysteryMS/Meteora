const EventListener = require('../structures/EventListener')
const guild = require('../../models/guild')

class ChannelUpdateListener extends EventListener {
  constructor () {
    super('channelUpdate')
  }
  async run (oldChannel, newChannel) {
    guild.findOne({ _id: newChannel.guild.id }, function (err, database) {
      if (err) console.log(err)
      if (newChannel.id === database.counterChannel && database.counterOn === true) {
        database.counterMessage = newChannel.topic
        database.save()
      }
    })
  }
}

module.exports = ChannelUpdateListener
