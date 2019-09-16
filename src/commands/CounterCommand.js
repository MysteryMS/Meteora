import Command from '../structures/Command'
import { findOne } from '../../models/guild'
import { RichEmbed } from 'discord.js'

class CounterCommand extends Command {
  constructor () {
    super('counter')
    this.name = 'Counter'
    this.description = 'Exibe o número de membros do seu servidor no' +
      ' tópico de um canal'
    this.aliases = ['contador']
    this.usage = '-p'
    this.category = 'Gerenciamento do servidor'
    this.memberPermissions = ['MANAGE_CHANNELS']
    this.botPermissions = ['MANAGE_CHANNELS']
  }

  async run (message, args, { t }) {
    if (!args[0]) return this.explain()
    let database = await findOne({ _id: message.guild.id })
    switch (args[0]) {
      case 'enable':
        if (database.counterChannel === null) {
          if (!args[1]) {
            return message.reply(t('commands:counter.firstTimeID'))
          }
          if (!message.guild.channels.get(args[1])) return message.reply(t('commands:counter.invalidChannel'))
          database.counterChannel = args[1]
          database.counterOn = true
          database.counterMessage = this.client.channels.get(args[1]).topic
          database.save()
          message.reply(t('commands:counter.firstActive', { channel: args[1] }))
        } else if (database.counterOn === false) {
          database.counterOn = true
          database.save()
            .then(message.reply(t('commands:counter.activated')))
        }

        break

      case 'disable':
        if (database.counterChannel === null) {
          return message.reply(t('commands:counter.firstTimeDeactivating'))
        } else if (database.counterOn === true) {
          database.counterOn = false
          database.save()
          message.reply(t('commands:counter.deactivated'))
        }

        break

      case 'change-channel':
        if (database.counterChannel === null) {
          return message.reply(t('commands:firstTimeChangingChannel'))
        }
        if (!message.guild.channels.get(args[1])) return message.reply(t('commands:counter.invalidChannel'))
        database.counterChannel = args[1]
        database.counterMessage = this.client.channels.get(args[1]).topic
        database.save().then(() => message.reply(t('commands:counter.channelChanged')))
        break

      case '-p':
        message.channel.send(new RichEmbed()
          .setTitle(t('descriptions:commands.counterTitle'))
          .setDescription(t('descriptions:commands.counterDesc'))
          .addField('enable <id>', t('descriptions:commands.counterEnableDesc'))
          .addField('disable', t('descriptions:commands.counterDisable'))
          .addField('--channel', t('descriptions:commands.counterChangeChannel'))
          .setColor('#54abff')
        )
        break
    }
  }
}

export default CounterCommand
