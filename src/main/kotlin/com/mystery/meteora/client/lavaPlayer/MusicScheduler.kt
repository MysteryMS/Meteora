package com.mystery.meteora.client.lavaPlayer

import com.sedmelluq.discord.lavaplayer.track.AudioTrack
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

data class MusicScheduler(
  val track: AudioTrack,
  val context: MessageReceivedEvent,
  val authorId: Long
)