package com.mystery.meteora.client.events

import com.mystery.meteora.client.lavaPlayer.PlayerController
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.guild.voice.GuildVoiceMoveEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import java.awt.Color

class VoiceChannelMoveEvent : ListenerAdapter() {
  override fun onGuildVoiceMove(event: GuildVoiceMoveEvent) {
    val player = PlayerController.findManager(event.guild.idLong) ?: return
    event.guild.members.find { member ->
      member.idLong == event.jda.selfUser.idLong }?.voiceState?.channel?.name
      ?: return
    if (event.channelLeft.members.size == 1) {
      val textChannel = PlayerController.findManager(event.guild.idLong)?.defaultChannel
      player.trackScheduler.stop(event.guild)
      val embed = EmbedBuilder()
        .setDescription("<:voiceleave:561612800804388914> – All members have been left from the voice channel, disconnecting from `\uD83D\uDD09 ${event.channelLeft.name}`!")
        .setColor(Color(217, 63, 63))
      textChannel?.sendMessage(embed.build())?.queue()
    }
  }
}