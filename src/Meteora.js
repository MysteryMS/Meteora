require('colors')

const { Client } = require('discord.js')
const Discord = require('discord.js')
const { readSync } = require('readdir')
const LavalinkManager = require('../lavalink/LavalinkManager')
const mongoose = require('mongoose')
const LocaleManager = require('./utils/LocaleManager')
const sentry = require('@sentry/node')
const Extensions = require('./utils/Extensions')

class Meteora extends Client {
  constructor (options = {}) {
    super(options)
  }

  async start (token) {
    try {
      this.commands = []
      this.player = new Discord.Collection()
      this.lavalinkManager = new LavalinkManager(this)
      await mongoose.connect('mongodb://meteora:oaUKzwfSahrcl9k7@altair-shard-00-00-pclds.mongodb.net:27017,altair-shard-00-01-pclds.mongodb.net:27017,altair-shard-00-02-pclds.mongodb.net:27017/test?ssl=true&replicaSet=Meteora-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => this.info('🔌  – Database connection established')).catch(e => this.error(e))
      this.localeManager = new LocaleManager()
      this.info('Attempting Lavalink connection...')
      this.lavalinkManager.manager.connect()
        .catch(err => { this.error('[LAVALINK CONNECTION ERROR] '.brightRed + err) })
      this.info('Connecting to Sentry...')
      sentry.init({ dsn: 'https://8632a477b57e427b901477bebcfd812f@o388147.ingest.sentry.io/5224877' })
      await this.login(token)
      // require('../dashboard/dashboard')(this)

      this.registerListeners()
      this.registerCommands()

      new Extensions(this).loadExtensions()

      this.info('🔌  – Websocket connection established ')
      this.headsup(`🧿  – Ongoing connection with ${this.guilds.cache.size} guilds`)
    } catch (err) {
      this.error(`❌  – Failed to start application\n${err.stack}`)
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

  headsup (msg, ...args) {
    console.log(`[${'HEADS UP!'.underline.bold.cyan}]`, msg, ...args)
  }

  info (msg, ...args) {
    console.log(`[${'INFO'.bold.white}]`, msg, ...args)
  }

  warn (msg, ...args) {
    console.log(`[${'WARN'.yellow}]`, msg, ...args)
  }

  error (msg, ...args) {
    console.log(`[${'ERROR'.bold.red}]`, msg, ...args)
  }
}

module.exports = Meteora
