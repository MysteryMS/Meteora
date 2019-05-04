const { RichEmbed } = require("discord.js")

class Command {

  constructor (label, aliases = []) {
    this.label = label
    this.aliases = aliases
    this.usage = ''
    this.onlyOwner = false
    this.description = ''
    this.memberPermissions = []
    this.botPermissions = []
  }

  run(message, args) {}

  register(client) {
    this.client = client

    client.commands.push(this)
  }

  async handle(message) {
    const rawArgs = message.content.split(" ")
    const usedLabel = rawArgs[0]

    const prefix = process.env.PREFIX
    const labels = [this.label]
    const guild = require('../../models/guild')
    const Discord = require('discord.js')

    this.aliases.forEach((alias) => {
      labels.push(alias)
    })

    const withPrefixLabels = labels.map((label) => prefix + label)

    if (withPrefixLabels.includes(usedLabel)) {
      try {
        const start = Date.now()
        this.client.info("[COMMAND EXECUTED]".yellow, `(${message.guild.name} -> #${message.channel.name}) ${message.author.tag}: ${message.content}`)

        message.channel.startTyping()

        const args = rawArgs
        args.shift()

        const missingMemberPermissions = this.memberPermissions.filter((permission) => !message.member.hasPermission(permission))

        if (missingMemberPermissions.length !== 0) { // ;w;
          message.reply("Você não tem permissão para executar este comando!")
          return true
        }

        const missingBotPermissions = this.botPermissions.filter((permission) => !message.guild.me.hasPermission(permission))

        if (missingBotPermissions.length !== 0) {
          message.reply(`Eu não consigo executar este comando pois eu preciso das permissões \`${missingBotPermissions.join(", ")}\`!`)
          return true
        }

        if (this.onlyOwner && message.author.id !== process.env.OWNER_ID) {
          message.reply("Você não tem permissão para executar este comando!")
          return true
        }

        if (args[0] === "🤷") {
          this.explain(message)
          return true
        }
        guild.findOne({_id: message.guild.id}, async (err, database) => {
          const t = message.client.localeManager.getT(database.language)
          //
          await this.run(message, args, { t })
        })
        //const t = this.client.localeManager.getT(guild.language)
        //await this.run(message, args, { t })

        this.client.info("[COMMAND EXECUTED]".blue, `(${message.guild.name} -> #${message.channel.name}) ${message.author.tag}: ${message.content} - OK! Finished in ${Date.now() - start}ms`)
      } catch (err) {
        message.channel.send(`<:erro_tick:558836213554085908> **|** ${message.author} Um erro inesperado ocorreu na execução deste comando!\n\`${err}\``)

        this.client.error("[COMMAND EXECUTED]".red, `(${message.guild.name} -> #${message.channel.name}) ${message.author.tag}: ${message.content} - ERROR!\n${err.stack}`)
      }

      message.channel.stopTyping()

      return true
    }

    return false
  }

    async explain(message) {
    const splitted = message.content.split(" ")

    const usedLabel = splitted[0].replace(process.env.PREFIX, "")
    const allLabels = [this.label]
    this.aliases.forEach((alias) => allLabels.push(alias))
    const unusedLabels = allLabels.filter((label) => label !== usedLabel)
    const embed = new RichEmbed()
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL)
    embed.setTitle(":cyclone: `" + process.env.PREFIX + usedLabel + "`")
    embed.setDescription(this.description)
    embed.addField(":interrobang: Como usar?", `\`${process.env.PREFIX + usedLabel} ${this.usage}\``, false)
    embed.addField(":twisted_rightwards_arrows: Alternativas", `${unusedLabels.map((label) => "`" + process.env.PREFIX + label + "`").join(", ")}`, false)

    embed.setColor("#650b29")

    embed.setFooter("Executado")
    embed.setTimestamp(new Date())

    message.channel.send({ embed })
  }
}

module.exports = Command