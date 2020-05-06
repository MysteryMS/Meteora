const { MessageEmbed } = require('discord.js')

class Command {
  constructor (label, aliases = []) {
    this.label = label
    this.aliases = aliases
    this.usage = ''
    this.onlyOwner = false
    this.description = ''
    this.beta = false
    this.category = ''
    this.memberPermissions = []
    this.botPermissions = []
  }

  run (message, args) {}

  register (client) {
    this.client = client

    client.commands.push(this)
  }

  async handle (message) {
    const rawArgs = message.content.split(' ')
    const guild = require('../../models/guild')
    const usedLabel = rawArgs[0]
    const labels = [this.label]
    // const Discord = require('discord.js')

    this.aliases.forEach((alias) => {
      labels.push(alias)
    })
    guild.findOne({ _id: message.guild.id }, (err, database) => {
      const server = database
      const t = this.client.localeManager.getT(database.language)
      const prefix = database.prefix
      if (err) console.log(err)
      const withPrefixLabels = labels.map((label) => prefix + label)

      if (withPrefixLabels.includes(usedLabel)) {
        try {
          message.channel.startTyping()

          const args = rawArgs
          args.shift()

          const missingMemberPermissions = this.memberPermissions.filter((permission) => !message.member.hasPermission(permission))

          if (missingMemberPermissions.length !== 0) { // ;w;
            if (missingMemberPermissions.length === 1) {
              message.reply(t('descriptions:structures.singlePermission', { permissions: missingMemberPermissions.join(', ') }))
              return true
            }
            if (missingMemberPermissions.length > 1) {
              message.reply(t('descriptions:structures.multiPermissions', { permissions: missingMemberPermissions.join(', ') }))
              return true
            }
          }

          const missingBotPermissions = this.botPermissions.filter((permission) => !message.guild.me.hasPermission(permission))

          if (missingBotPermissions.length !== 0) {
            message.reply(t('descriptions:structures.botNoPerm', { permissions: missingBotPermissions.join(', ') }))
            return true
          }

          if (this.onlyOwner && message.author.id !== process.env.OWNER_ID) {
            message.reply(t('descriptions:structures.noPerm'))
            return true
          }
          if (this.beta) {
            message.reply(t('descriptions:structures.betaCommand'))
          }

          if (args[0] === '🤷') {
            this.explain(message)
            return true
          }
          guild.findOne({ _id: message.guild.id }, async (err, database) => {
            if (err) console.log(err)
            const t = message.client.localeManager.getT(database.language)
            await this.run(message, args, server, { t })
          })
        } catch (err) {
          message.channel.send(t('descriptions:structures.error', { member: message.author, err: err }))

          this.client.error('[COMMAND EXECUTED]'.red, `(${message.guild.name} -> #${message.channel.name}) ${message.author.tag}: ${message.content} - ERROR!\n${err.stack}`)
        }

        message.channel.stopTyping()

        return true
      } // aqui
    })

    return false
  }

  async explain (message) {
    const guild = require('../../models/guild')
    const server = await guild.findOne({ _id: message.guild.id })
    const t = this.client.localeManager.getT(server.language)
    const splitted = message.content.split(' ')
    const usedLabel = splitted[0].replace(server.prefix, '')
    const allLabels = [this.label]
    this.aliases.forEach((alias) => allLabels.push(alias))
    const unusedLabels = allLabels.filter((label) => label !== usedLabel)
    const embed = new MessageEmbed()
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL())
    embed.setTitle('🔤 `' + server.prefix + usedLabel + '`')
    embed.setDescription(t(`descriptions:descriptions.${this.label}`))
    embed.addField(t('descriptions:structures.embedHowUse'), `\`${server.prefix + usedLabel} ${t(`commands:${this.usage}.usage`)}\``, false)
    embed.addField(t('descriptions:structures.embedAliases'), `${!this.aliases ? unusedLabels.map((label) => '`' + server.prefix + label + '`').join(', ') : t('descriptions:structures.noAliases')}`, false)
    embed.setColor('#1e1e1e')
    embed.setFooter(t('descriptions:structures.executed'))
    embed.setTimestamp(new Date())

    message.channel.send({ embed })
  }

  async justify (message) {
    const guild = require('../../models/guild')
    const server = await guild.findOne({ _id: message.guild.id })
    const t = this.client.localeManager.getT(server.language)
    const splitted = message.content.split(' ')
    const usedLabel = splitted[0].replace(server.prefix, '')
    const allLabels = [this.label]
    this.aliases.forEach((alias) => allLabels.push(alias))
    const embed = new MessageEmbed()
    const unusedLabels = allLabels.filter((label) => label !== usedLabel)
    embed.setTitle('🔤 `' + server.prefix + usedLabel + '`')
    embed.addField(t('descriptions:structures.embedAliases'), `${!this.aliases ? unusedLabels.map((label) => '`' + server.prefix + label + '`').join(', ') : t('descriptions:structures.noAliases')}`, false)
    embed.setDescription(t(`descriptions:justify.${this.label}`, { prefix: server.prefix }))
    embed.setColor('#1e1e1e')

    embed.setAuthor(message.author.tag, message.author.displayAvatarURL())
    embed.setFooter(t('descriptions:structures.executed'))
    embed.setTimestamp(new Date())

    message.channel.send({ embed })
  }
}

module.exports = Command
