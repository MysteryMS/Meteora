package com.mystery.meteora.client.lavaPlayer


import com.mystery.meteora.backend.controller.models.deezer.TrackObject
import com.sedmelluq.discord.lavaplayer.player.AudioPlayerManager
import com.sedmelluq.discord.lavaplayer.player.DefaultAudioPlayerManager
import com.sedmelluq.discord.lavaplayer.source.AudioSourceManagers
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.net.URI
import java.net.URISyntaxException

class PlayerController(private val context: MessageReceivedEvent?) {
  val playerManager: AudioPlayerManager = DefaultAudioPlayerManager()
  val manager: GuildMusicManager = addOrFindManager()

  companion object {
    val guildsMusic: MutableList<GuildMusicManager> = mutableListOf()
    fun findManager(guildIdLong: Long): GuildMusicManager? {
      return guildsMusic.find { x ->
        x.idGuild == guildIdLong
      }
    }
  }

  init {
    AudioSourceManagers.registerRemoteSources(playerManager)
    AudioSourceManagers.registerLocalSource(playerManager)
  }


  fun play(query: String) {
    val manager = addOrFindManager()
    try {
      playerManager.loadItemOrdered(
        manager,
        URI(query).toString(),
        AudioLoadResultHandlerConfig(manager.trackScheduler, context!!, false)
      )
    } catch (e: URISyntaxException) {
      playerManager.loadItemOrdered(
        manager,
        "ytsearch:$query",
        AudioLoadResultHandlerConfig(manager.trackScheduler, context!!, false)
      )
    }

  }

  fun loadFlow(list: List<TrackObject>) {

  }

  fun playNow(query: String) {
    val manager = addOrFindManager()
    try {
      playerManager.loadItemOrdered(
        manager,
        URI(query).toString(),
        AudioLoadResultHandlerConfig(manager.trackScheduler, context!!, true)
      )
    } catch (e: URISyntaxException) {
      playerManager.loadItemOrdered(
        manager,
        "ytsearch:$query",
        AudioLoadResultHandlerConfig(manager.trackScheduler, context!!, true)
      )
    }
  }

  private fun addOrFindManager(): GuildMusicManager {
    var manager = guildsMusic.find { x ->
      x.idGuild == context!!.guild.idLong
    }
    return if (manager != null) {
      manager
    } else {
      manager = GuildMusicManager(playerManager, context!!)
      context.guild.audioManager.sendingHandler = manager.jdaLavaConfig
      guildsMusic.add(manager)
      manager
    }
  }
}