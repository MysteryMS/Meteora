const Command = require('../structures/Command')
const xuxa = require('../../models/guild')
const { RichEmbed } = require('discord.js')

class MessageCommand extends Command {
  constructor () {
    super('messages')
    this.category = 'Gerenciamento do servidor'
    this.name = 'Messages'
    this.usage = '-p'
  }

  async run (message, args, { t }) {
    if (!args[0]) return this.explain()
    let guild = await xuxa.findOne({ _id: message.guild.id })
    let channel = args[2]
    let messag = args.slice(3).join(' ')
    switch (args[0]) {
      case 'enable':
        switch (args[1]) {
          case 'join':
            if (!guild.wMessageOn) {
              if (!args[2]) return message.reply(t('commands:join.noChannel'))
              if (!args[3]) return message.reply(t('commands:join.noMessage'))
              if (!message.guild.channels.get(channel)) return message.reply(t('commands:message.invalidChannel'))
              guild.wMessage = messag
              guild.wMessageChannel = channel
              guild.wMessageOn = true
              guild.save().then(() => message.reply(t('commands:join.successfullyActivated', { channel: `<#${channel}>`, message: messag })))
            } else {
              guild.wMessageOn = true
              guild.save().then(() => message.reply(t('commands:join.activated')))
            }
            break
          case 'leave':
            if (!guild.leaveMessage) {
              if (!args[2]) return message.reply(t('commands:leave.noChannel'))
              if (!args[3]) return message.reply(t('commands:leave.noMessage'))
              if (!message.guild.channels.get(channel)) return message.reply(t('commands:message.invalidChannel'))
              guild.leaveMessageMessage = messag
              guild.leaveMessageChannel = channel
              guild.leaveMessage = true
              guild.save().then(() => message.reply(t('commands:leave.successfullyActivated', { channel: `<#${channel}>`, message: messag })))
            } else {
              guild.leaveMessage = true
              guild.save().then(() => message.reply(t('commands:leave.activated')))
            }
        }
        break
      case '-p':
        message.channel.send(new RichEmbed()
          .setTitle('Exibindo parâmetros para as mensagens de boas vindas e saída')
          .setDescription('Use `{user-id}` para exibir o ID do usuário\nUse `{user-avatar}` para exibir a foto de perfil do usuário\nUse `{@user}` para mencionar o usuário\nUse `{user-name}` para exibir o nome do usuário\nUse `{user-tag}` para exibir o nome **__e__** a tag do usuário\nUse `{guild-name}` para exibir o nome do servidor\nUse `{guild-id}` para exibir o ID do servidor\nUse `{guild-icon}` para exibir a foto do servidor')
          .addField(`${guild.prefix}enable join/leave [canal] [mensagem]`, 'Ativa as  mensagens de boas vindas/saída (necessário colocar o canal e a mensagem somente quando ativando pela primeira vez')
          .addField(`${guild.prefix}disable join/leave`, 'Desativa as mensagens de boas vindas/saída')
          .addField(`${guild.prefix}update join/leave channel/message`, 'Atualiza o canal/mensagem das mensagens de boas vindas/saída')
          .setColor('#ffb556')
        )
        break
      case 'disable':
        switch (args[1]) {
          case 'join':
            if (guild.wMessageOn === null) {
              guild.wMessageOn = null
              return guild.save().then(() => message.reply(t('commands:join.deactivated')))
            } else {
              guild.wMessageOn = false
              guild.save().then(() => message.reply(t('commands:join.deactivated')))
            }
            break
          case 'leave':
            if (guild.leaveMessage === null) {
              guild.leaveMessage = null
              return guild.save().then(() => message.reply(t('commands:leave.deactivated')))
            } else {
              guild.leaveMessage = false
              guild.save().then(() => message.reply(t('commands:leave.deactivated')))
            }
        }
        break
      case 'update':
        switch (args[1]) {
          case 'join':
            switch (args[2]) {
              case 'channel':
                if (!guild.wMessageOn) return message.reply(t('commands:join.needFirstAct'))
                let channel3 = args[3]
                if (!channel3) return message.reply(t('commands:join.noChannel'))
                if (!message.guild.channels.get(channel3)) return message.reply(t('commands:message.invalidChannel'))
                guild.wMessageChannel = args[3]
                guild.save().then(() => message.reply(t('commands:join.channelChanged', { 'channel': `<#${args[3]}>` })))
                break
              case 'message':
                if (!guild.wMessageOn) return message.reply(t('commands:join.needFirstAct'))
                let message3 = args.slice(3).join(' ')
                if (!args[3]) return message.reply(t('commands:join.noChannel'))
                guild.wMessageMessage = message3
                guild.save().then(() => message.reply(t('commands:join.messageChanged', { message: message3 })))
            }
            break
          case 'leave':
            switch (args[2]) {
              case 'channel':
                if (!guild.leaveMessage) return message.reply(t('commands:join.needFirstAct'))
                let channel3 = args[3]
                if (!channel3) return message.reply(t('commands:leave.noChannel'))
                if (!message.guild.channels.get(channel3)) return message.reply(t('commands:message.invalidChannel'))
                guild.leaveMessageChannel = args[3]
                guild.save().then(() => message.reply(t('commands:leave.channelChanged', { 'channel': `<#${args[3]}>` })))
                break
              case 'message':
                if (!guild.leaveMessage) return message.reply(t('commands:join.needFirstAct'))
                let message3 = args.slice((3).join(' '))
                if (!args[3]) return message.reply(t('commands:leave.noChannel'))
                guild.leaveMessageMessage = message3
                guild.save().then(() => message.reply(t('commands:leave.messageChanged', { message: message3 })))
            }
        }
    }
  }
}

module.exports = MessageCommand
