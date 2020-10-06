package com.mystery.meteora.client.lavaPlayer

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.translate
import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist
import com.sedmelluq.discord.lavaplayer.track.AudioTrack
import io.sentry.Sentry
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color
import kotlin.random.Random

class AudioLoadResultHandlerConfig(
  private val trackScheduler: TrackScheduler,
  private val context: MessageReceivedEvent,
  private val shouldPlayNow: Boolean,
  private val silent: Boolean
) : AudioLoadResultHandler {
  private val config = Config("./meteora.json")

  override fun loadFailed(exception: FriendlyException?) {
    val msgNum = List(1) { Random.nextInt(1, 3) }
    context.jda.textChannelCache.getElementById(750788166012764220)!!.sendMessage("An error occurred in the guild `${context.guild.name} (${context.guild.id})`. Command is `${context.message.contentDisplay}`.\nError is `${exception}`").queue()
    context.channel.sendMessage("global.error.loadFailed${msgNum[0]}".translate(config, context.guild.id)).queue()
    Sentry.capture(exception)
  }

  override fun trackLoaded(track: AudioTrack?) {
    if (silent) {
      if (track != null) {
        trackScheduler.queue(track, context)
      }
      return
    }
    if (context.member?.voiceState?.inVoiceChannel()!!) {
      val client = context.guild.selfMember
      if (client.voiceState?.inVoiceChannel()!! && client.voiceState!!.channel?.idLong != context.member!!.voiceState?.channel?.idLong) {
        context.channel.sendMessage("global.divergentVoiceChannel".translate(config, context.guild.id)).queue()
        return
      }
      context.guild.audioManager.openAudioConnection(context.member?.voiceState?.channel)
      if (track != null) {
        if (shouldPlayNow) {
          trackScheduler.playNow(track, context)
          return
        }
        trackScheduler.queue(track, context)
        if (PlayerController(context).manager.trackScheduler.queue.size > 0) {
          val embed = EmbedBuilder()
            .setDescription("queue.added".translate(config, context.guild.id, track.info.title))
            .setColor(Color(152, 153, 153))
          context.channel.sendMessage(embed.build()).queue()
        }
      }
    }

  }

  override fun noMatches() {
    context.channel.sendMessage("queue.noMatches".translate(config, context.guild.id)).queue()
  }

  override fun playlistLoaded(playlist: AudioPlaylist?) {
    val client = context.guild.selfMember
    if (client.voiceState?.inVoiceChannel()!! && client.voiceState!!.channel?.idLong != context.member!!.voiceState?.channel?.idLong) {
      context.channel.sendMessage("global.divergentVoiceChannel".translate(config, context.guild.id)).queue()
      return
    }
    context.guild.audioManager.openAudioConnection(context.member?.voiceState?.channel)
    if (!playlist?.isSearchResult!!) {
      for (track in playlist.tracks!!) {
        trackScheduler.queue(track, context)
      }
    } else {
      trackLoaded(playlist.tracks[0])
    }
  }

}