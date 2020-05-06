const Command = require('../structures/Command')
const fetch = require('node-fetch')
const { MessageAttachment } = require('discord.js')

class LastfmCommand extends Command {
  constructor () {
    super('lastfm')
    this.category = 'music'
  }

  async run (message, args, server, { t }) {
    if (!args[0]) return this.justify(message)
    const themes = {
      'duotone/purplish': ['duotone', 'purplish'],
      'duotone/natural': ['duotone', 'natural'],
      'duotone/divergent': ['duotone', 'divergent'],
      'duotone/bright-sun': ['duotone', 'sun'],
      'duotone/yellish': ['duotone', 'yellish'],
      'duotone/horror': ['duotone', 'horror']
    }
    const tops = {
      artists: ['MOST LISTENED ARTISTS', 'artists'],
      albums: ['MOST LISTENED ALBUMS', 'albums'],
      tracks: ['MOST LISTENED TRACKS', 'tracks']
    }
    const theme = themes[args[2]] ? themes[args[2]] : ['duotone', 'natural']
    const top = tops[args[1]] ? tops[args[1]] : ['MOST LISTENED TRACKS', 'tracks']
    fetch('https://generator.musicorumapp.com/generate', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'meteora'
      },
      body: JSON.stringify({ theme: theme[0], options: { user: args[0], period: '6month', top: top[1], pallete: theme[1], story: false, messages: { scrobbles: ['scrobbles', 'last 6 months'], subtitle: 'last 7 days', title: top[0] } } })
    }).then(async response => {
      const res = await response.json()
      const buffer = Buffer.from(res.base64.replace('data:image/jpeg;base64,', ''), 'base64')
      message.channel.send(new MessageAttachment(buffer))
    })
  }
}

module.exports = LastfmCommand
