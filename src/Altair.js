require('colors')

const { Client } = require('discord.js')
const Discord = require('discord.js')
const { readSync } = require('readdir')
const LavalinkManager = require('../lavalink/LavalinkManager')
const mongoose = require('mongoose')
const LocaleManager = require('./utils/LocaleManager')
const Extensions = require('./utils/Extensions')

class Altair extends Client {
  constructor (options = {}) {
    super(options)
  }

  async start (token) {
    try {
      this.commands = []
      this.player = new Discord.Collection()
      this.lavalinkManager = new LavalinkManager(this)
      await mongoose.connect('mongodb+srv://MysteryMS:xuxameneghel@altair-pclds.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }).then(() => this.info('Conexão estabelecida com o banco de dados'))
      this.localeManager = new LocaleManager()

      await this.login(token)

      this.registerListeners()
      this.registerCommands()

      new Extensions(this).loadExtensions()

      this.info('Conectado ao websocket')
      this.atenttion(`Conexão estabelecida com ${this.guilds.cache.size} servidores`)
    } catch (err) {
      this.error(`Erro!\n${err.stack}`)
    }
  }

  registerListeners () {
    const folder = readSync('./src/listeners')

    folder.forEach((file) => {
      const EventListener = require(`./listeners/${file}`)
      const listener = new EventListener()

      listener.register(this)
    })
  }

  registerCommands () {
    const folder = readSync('./src/commands')

    folder.forEach((file) => {
      const Command = require(`./commands/${file}`)
      const command = new Command()

      command.register(this)
    })
  }

  atenttion (msg, ...args) {
    console.log(`[${'ATTENTTION'.underline.cyan}]`, msg, ...args)
  }

  info (msg, ...args) {
    console.log(`[${'INFO'.bold.green}]`, msg, ...args)
  }

  warn (msg, ...args) {
    console.log(`[${'WARN'.yellow}]`, msg, ...args)
  }

  error (msg, ...args) {
    console.log(`[${'ERROR'.bold.red}]`, msg, ...args)
  }
}

module.exports = Altair
