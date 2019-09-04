const Command = require('../structures/Command')
const { RichEmbed } = require('discord.js')
const moment = require('moment')
const splashy = require('splashy')
const got = require('got')

class UserinfoCommand extends Command {
  constructor () {
    super('userinfo')
    this.name = 'Userinfo'
    this.aliases = ['ui', 'infouser', 'user']
    this.usage = '<@user/id>'
  }

  async run (message, args, { t }) {
    if ((args[0] && args[0].match(/<@!?[0-9]+>/g)) || (args[0] && args[0].match(/[0-9]/g))) {
      this.client.fetchUser(args[0].replace(/[^0-9]+/g, '')).then(async (user) => {
        if (user) {
          const url = user.displayAvatarURL
          const { body } = await got(url, { encoding: null })
          const palette = await splashy(body)
          let embed = new RichEmbed()
            .setThumbnail(user.displayAvatarURL)
            .setTitle(message.author.bot ? t('commands:userinfo.botUser', { user: user.tag }) : t('commands:userinfo.user', { user: user.tag }))
            .addField(t('commands:userinfo.createdAt'), moment(user.createdAt).format('LLLL'))
            .addField('Status', user.presence.status, true)
            .addField(t('commands:userinfo.userId'), user.id, true)
          message.guild.member(user) ? embed.setColor(message.guild.member(user) ? message.guild.member(user).highestRole.hexColor : palette[0]) : embed.setColor(palette[0])
          // eslint-disable-next-line no-unused-expressions
          message.guild.member(user) ? embed.addField(t('commands:userinfo.highestRole'), message.guild.member(user).highestRole, true) : undefined
          // eslint-disable-next-line no-unused-expressions
          message.guild.member(user) ? embed.addField(t('commands:userinfo.admField'), message.guild.member(user).hasPermission('ADMINISTRATOR') ? t('commands:userinfo.administrator') : t('commands:userinfo.noAdm'), true) : undefined
          message.channel.send(embed)
        } else {
          message.channel.send(`user ${args[0]} doesn't exist`)
        }
      }).catch((error) => console.error(error))
    } else {
      const url = message.author.displayAvatarURL
      const { body } = await got(url, { encoding: null })
      const palette = await splashy(body)
      let embed = new RichEmbed()
        .setThumbnail(message.author.displayAvatarURL)
        .setTitle(message.author.bot ? t('commands:userinfo.botUser', { user: message.author.tag }) : t('commands:userinfo.user', { user: message.author.tag }))
        .addField(t('commands:userinfo.createdAt'), moment(message.author.createdAt).format('LLLL'))
        .addField('Status', message.author.presence.status, true)
        .setColor(message.guild.member(message.author) ? message.guild.member(message.author).highestRole.hexColor : palette[0])
        .addField(t('commands:userinfo.userId'), message.author.id, true)
        .addField(t('commands:userinfo.highestRole'), message.guild.member(message.author).highestRole, true)
        .addField('Administrador?', message.guild.member(message.author).hasPermission('ADMINISTRATOR') ? t('commands:userinfo.administrator') : t('commands:userinfo.noAdm'), true)
      message.channel.send(embed)
    }
  }
}

module.exports = UserinfoCommand
