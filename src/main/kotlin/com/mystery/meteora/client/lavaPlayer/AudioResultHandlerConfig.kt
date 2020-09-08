package com.mystery.meteora.client.lavaPlayer

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist
import com.sedmelluq.discord.lavaplayer.track.AudioTrack
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

class AudioLoadResultHandlerConfig(
  private val trackScheduler: TrackScheduler,
  private val context: MessageReceivedEvent,
  private val shouldPlayNow: Boolean
) : AudioLoadResultHandler {

  override fun loadFailed(exception: FriendlyException?) {
    context.jda.textChannelCache.getElementById(750788166012764220)!!.sendMessage("An error occurred in the guild `${context.guild.name} (${context.guild.id})`. Command is ${context.message.contentDisplay}.\nError: `${exception}`")
    context.channel.sendMessage("Oh no! Something went wrong while using this command, but don't worry! We tracked the error and will solve as soon as possible.").queue()
  }

  override fun trackLoaded(track: AudioTrack?) {
    if (context.member?.voiceState?.inVoiceChannel()!!) {
      context.guild.audioManager.openAudioConnection(context.member?.voiceState?.channel)
      if (track != null) {
        if (shouldPlayNow) {
          trackScheduler.playNow(track, context)
          return
        }
        trackScheduler.queue(track, context)
        if (PlayerController(context).manager.trackScheduler.queue.size > 0) {
          val embed = EmbedBuilder()
            .setDescription("<:queuemusic:571414423152099328> – Added `${track.info.title}` to the queue")
            .setColor(Color(152, 153, 153))
          context.channel.sendMessage(embed.build()).queue()
        }
      }
    }

  }

  override fun noMatches() {
    context.channel.sendMessage("Oops! No matches found...").queue()
  }

  override fun playlistLoaded(playlist: AudioPlaylist?) {
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