const { Manager } = require('@lavacord/discord.js')
const { EventEmitter } = require('events')
const guild = require('../models/guild')
const pms = require('pretty-ms')
require('colors')
const otherNodes = [{ host: '13.90.193.26', port: '2333', password: 'youshallnotpass', id: '1' }]

class Player extends EventEmitter {
  constructor (player) {
    super()
    this.player = player
    this.queue = []
    this.nowPlaying = ''
    this.channel = {}
    this.repeatTrack = ''
    this.repeat = false
    this.playlistSongs = []
    this.playlist = false
    this.playlistId = ''
  }

  play (query) {
    return getSongs(this.player.node, `ytsearch:${query}`).then(a => {
      if (!a[0]) return null
      this._addToQueue(a[0])
      return a[0].info
    })
  }

  skip () {
    if (this.playlist === true) return this.loadPlaylist(this.playlistSongs)
    const nextSong = this.queue.shift()
    if (!nextSong) return
    this.player.play(nextSong.track)
    return this.emit('playMusic', nextSong)
  }

  seek (pos) {
    return this.player.seek(pos)
  }

  _addToQueue (track) {
    if (!this.player.playing && !this.player.paused) {
      return this._play(track)
    }
    return this.queue.push(track)
  }

  playNow (query) {
    getSongs(this.player.node, `ytsearch:${query}`).then(results => {
      if (!results[0]) return null
      this._play(results[0])
      return results[0].info
    })
  }

  _play (track) {
    this.on('playMusic', async (track) => {
      const lang = await guild.findOne({ _id: this.channel.guild.id })
      const t = this.player.manager.client.localeManager.getT(lang.language)
      this.nowPlaying = track
      return this.channel.send(t('commands:music.nowPlaying', {
        trackInfo: track.info.title,
        trackDuration: pms(track.info.length)
      }))
    })
    this.player.on('end', (data) => {
      if (data.reason === 'REPLACED') return
      if (this.repeat) return this.player.play(this.repeatTrack)
      const nextSong = this.queue.shift()
      if (!nextSong) return
      this.player.play(nextSong.track)
      return this.emit('playMusic', nextSong)
    })
    this.player.on('error', (error) => {
      console.log('[LAVALINK ERROR]'.green.bold, error)
    })
    this.player.play(track.track)
    return this.emit('playMusic', track)
  }

  loadPlaylist (array) {
    const song = array.shift()
    if (!song) {
      this.player.playlist = false
      return this.player.stop()
    }
    getSongs(this.player.node, `ytsearch:${song}`).then(tracks => {
      const songToPlay = tracks[0]
      if (!songToPlay) return
      this.player.play(songToPlay.track)
      this.emit('playMusic', songToPlay)
      this.player.once('end', (data) => {
        if (data.reason === 'REPLACED') return
        this.loadPlaylist(this.player.playlistSongs)
      })
    })
  }
}

module.exports = class LavalinkManager {
  constructor (client) {
    this.client = client
    this.manager = new Manager(client, otherNodes, {
      user: '464304679128530954',
      shards: 1
    })
  }

  // getBestHost () {
  //   return nodes[Math.floor(Math.random() * nodes.length)]
  // }

  async join (channel) {
    return new Player(await this.manager.join({
      guild: this.client.channels.cache.get(channel).guild.id,
      channel: channel,
      node: otherNodes[0].id
    }, { selfdeaf: true }))
  }

  async search (query) {
    return getSongs(otherNodes[0], `ytsearch:${query}`)
  }
}

async function getSongs (node, search) {
  const fetch = require('node-fetch')
  const { URLSearchParams } = require('url')
  const params = new URLSearchParams()
  params.append('identifier', search)

  return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, { headers: { Authorization: node.password } }).then(res => res.json()).then(data => data.tracks).catch(err => {
    console.error(err)
    return null
  })
}
