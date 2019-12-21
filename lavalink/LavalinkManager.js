const { PlayerManager } = require('discord.js-lavalink')
const { EventEmitter } = require('events')
let nodes = require('../lavalinkNodes.json').hosts
nodes = nodes.map(a => {
  let obj = {}
  obj.host = a
  obj.port = '2333'
  obj.password = 'youshallnotpass'
  return obj
})

class Player extends EventEmitter {
  constructor (player) {
    super()
    this.player = player
    this.queue = []
    this.nowPlaying = ''
    this.messageChannel = ''
    this.repeatTrack = ''
    this.repeat = false
    this.playlistSongs = []
    this.playlist = false
  }

  play (query) {
    return getSongs(this.player.node, `ytsearch:${query}`).then(a => {
      if (!a[0]) return null
      this._addToQueue(a[0])
      return a[0].info
    })
  }

  skip () {
    this.nowPlaying = ''
    let nextSong = this.queue.shift()
    if (!nextSong) return
    this.player.play(nextSong.track)
    return this.emit('playingNow', nextSong)
  }

  setVolume (val) {
    if (val > 100) val = 100
    return this.player.volume(val)
  }

  seek (pos) {
    return this.player.seek(pos)
  }

  pause () {
    return this.player.paused ? this.player.resume() : this.player.pause()
  }

  _addToQueue (track) {
    if (!this.player.playing && !this.player.paused) {
      return this._play(track)
    }
    return this.queue.push(track)
  }

  _play (track) {
    this.player.on('end', (data) => {
      if (data.reason === 'REPLACED') return
      if (this.player.playlist === true) {
        this.loadPlaylist(this.playlistSongs)
      }
      if (this.repeat === true) return this.player.play(this.repeatTrack)
      let nextSong = this.queue.shift()
      if (!nextSong) return
      this.player.play(nextSong.track)
      this.emit('nowPlaying', nextSong)
    })
    this.player.play(track.track)
    return this.emit('nowPlaying', track)
  }

  loadPlaylist (t) {
    getSongs(this.player.node, `ytsearch:${t}`).then(a => {
      if (!a[0]) return null
      this.player.play(a[0].info.track)
      return this.emit('nowPlaying', a[0].info)
    })
  } 
} 

module.exports = class LavalinkManager {
  constructor (client) {
    this.client = client
    this.manager = new PlayerManager(client, nodes, {
      shards: 1,
      user: '464304679128530954'
    })
  }

  getBestHost () {
    return this.manager.nodes.array()[Math.floor(Math.random() * nodes.length)]
  }

  async join (channel) {
    return new Player(await this.manager.join({
      channel: channel,
      guild: this.client.channels.get(channel).guild.id,
      host: this.getBestHost().host
    }, { selfdeaf: true }))
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
