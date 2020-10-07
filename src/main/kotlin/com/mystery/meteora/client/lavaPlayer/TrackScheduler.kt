package com.mystery.meteora.client.lavaPlayer

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.model.Parser
import com.mystery.meteora.controller.translate
import com.sedmelluq.discord.lavaplayer.player.AudioPlayer
import com.sedmelluq.discord.lavaplayer.player.event.AudioEventAdapter
import com.sedmelluq.discord.lavaplayer.track.AudioTrack
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color
import java.util.concurrent.LinkedBlockingQueue


class TrackScheduler(
  private val audioPlayer: AudioPlayer
) :
  AudioEventAdapter() {
  var loop = false
  var bassBoost: Boolean = false
  var requestedByAuthorId: Long = 0
  val queue: LinkedBlockingQueue<MusicScheduler> = LinkedBlockingQueue()
  fun queue(track: AudioTrack, context: MessageReceivedEvent) {
    if (!audioPlayer.startTrack(track, true)) {
      queue.offer(MusicScheduler(track, context, context.author.idLong))
    } else {
      show(MusicScheduler(track, context, context.author.idLong))
    }
  }

  fun playNow(track: AudioTrack, context: MessageReceivedEvent) {
    audioPlayer.startTrack(track, false)
    show(MusicScheduler(track, context, context.author.idLong))
    requestedByAuthorId = context.author.idLong
  }

  fun next() {
    val track = queue.poll()
    if (track != null) {
      audioPlayer.startTrack(track.track, false)
      show(track)
    }
  }

  fun loop() {
    loop = !loop
  }

  fun bass(bass: Boolean) {
    bassBoost = bass
  }

  fun stop(guild: Guild) {
    queue.clear()
    audioPlayer.stopTrack()
    guild.audioManager.closeAudioConnection()
  }

  private fun show(track: MusicScheduler) {
    val embed = EmbedBuilder()
    embed.setDescription(
      "play.nowPlaying".translate(
        Config("./meteora.json"),
        track.context.guild.id,
        track.track.info?.title!!,
        track.track.info?.author!!,
        Parser().parse(
          track.track.info?.length
        )
      )
    )
    embed.setFooter("Requested by ${track.context.author.name}", track.context.author.avatarUrl)
    embed.setColor(Color(115, 140, 213))
    val channel = PlayerController.findManager(track.context.guild.idLong)?.defaultChannel
    channel?.sendMessage(embed.build())?.queue()
    requestedByAuthorId = track.context.author.idLong
  }

  override fun onTrackEnd(player: AudioPlayer?, track: AudioTrack?, endReason: AudioTrackEndReason?) {
    if (endReason == AudioTrackEndReason.CLEANUP) {
      println("bucetao")
    }
    if (!endReason?.mayStartNext!!) return
    if (loop) {
      audioPlayer.startTrack(track?.makeClone(), false)
    } else {
      next()
    }

  }


}