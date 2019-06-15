const EventListener = require('../structures/EventListener')
const Guild = require('../../models/guild')

class GuildMemberAddListener extends EventListener {
  constructor () {
    super('guildMemberAdd')
  }

  async run (member) {
    function isJson (str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }

    const map = {
      '0': '0⃣',
      '1': '1⃣',
      '2': '2⃣',
      '3': '3⃣',
      '4': '4⃣',
      '5': '5⃣',
      '6': '6⃣',
      '7': '7⃣',
      '8': '8⃣',
      '9': '9⃣'
    }
    const counter = member.guild.memberCount.toString().split('').map(str => map[str]).join('')
    Guild.findOne({ _id: member.guild.id }, async (err, database) => {
      if (err) console.log(err)
      if (database.counterChannel !== null && database.counterMessage !== null && database.counterOn === true) {
        await this.client.guilds.get(member.guild.id).channels.get(database.counterChannel).setTopic(database.counterMessage.replace('[counter]', counter))
      }
      if (database.wMessageOn === true && database.wMessageMessage !== null && database.wMessageChannel !== null) {
        let values = {
          'user-id': member.user.id,
          'user-avatar': member.user.displayAvatarURL,
          '@user': member.toString(),
          'user-name': member.user.username,
          'user-tag': member.user.tag,
          'guild-id': member.guild.id,
          'guild-name': member.guild.name,
          'guild-icon': member.guild.iconURL
        }
        let text = database.wMessageMessage
        for (let prop in values) {
          text = text.replace(`{${prop}}`, values[prop])
        }
        if (isJson(text)) {
          this.client.guilds.get(member.guild.id).channels.get(database.leaveMessageChannel).send(JSON.parse(text))
        } else {
          this.client.guilds.get(member.guild.id).channels.get(database.leaveMessageChannel).send(text)
        }
      }
    })
  }
}

module.exports = GuildMemberAddListener
