require("dotenv").config()

if (!process.env.TOKEN) {
  console.error("Você não definiu a variável \"TOKEN\" no \".env\"!")
  process.exit(1)
}

const token = process.env.TOKEN
const Altair = require("./src/Altair")

const bot = new Altair()
bot.start(token)