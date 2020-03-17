const EventListener = require('../structures/EventListener')
const guild = require('../../models/guild')

class ChannelUpdateListener extends EventListener {
  constructor () {
    super('channelUpdate')
  }

  async run (oldChannel, newChannel) {
    guild.findOne({ _id: newChannel.guild.id }, (err, database) => {
      const map = {
        0: '0⃣',
        1: '1⃣',
        2: '2⃣',
        3: '3⃣',
        4: '4⃣',
        5: '5⃣',
        6: '6⃣',
        7: '7⃣',
        8: '8⃣',
        9: '9⃣'
      }
      const counter = oldChannel.guild.memberCount.toString().split('').map(str => map[str]).join('')
      if (err) console.log(err)
      if (newChannel.id === database.counterChannel && database.counterOn === true) {
        database.counterMessage = newChannel.topic.replace(counter, '[counter]')
        database.save()
      }
    })
  }
}

module.exports = ChannelUpdateListener
