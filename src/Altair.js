require("colors")

const { Client } = require('discord.js')
const Discord = require('discord.js')
const { readSync } = require('readdir')
const LavalinkManager = require('../lavalink/LavalinkManager')
const mongoose = require('mongoose')
const path = require('path')
const LocaleManager = require(path.join('/utils/LocaleManager'))

const Extensions = require('./utils/Extensions')

class Altair extends Client {
  constructor (options = {}) {
    super(options)
  }

  async start (token) {
    try {
      this.commands = []
      this.calls = new Discord.Collection()
      this.lavalinkManager = new LavalinkManager(this)
      await mongoose.connect('mongodb://mysteryms:marinadiamonds1@ds059722.mlab.com:59722/altair', { useNewUrlParser: true }).then(() => console.log('> | Conectado ao Banco de Dados'.blue))
      this.localeManager = new LocaleManager()

      await this.login(token)

      this.registerListeners()
      this.registerCommands()

      new Extensions(this).loadExtensions()

      this.info('Altair inicializada com sucesso!')
      this.info(`${this.user.tag} - ${this.user.id}`)
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

  info (msg, ...args) {
    const date = new Date()

    console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}]`.yellow, `[${"INFO".blue}]`, msg, ...args)
  }

  warn (msg, ...args) {
    const date = new Date()

    console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}]`.yellow, `[${"WARN".yellow}]`, msg, ...args)
  }

  error (msg, ...args) {
    const date = new Date()

    console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}]`.yellow, `[${"ERROR".red}]`, msg, ...args)
  }
}

module.exports = Altair
