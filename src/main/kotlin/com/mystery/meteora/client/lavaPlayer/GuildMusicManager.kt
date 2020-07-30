package com.mystery.meteora.client.lavaPlayer

import com.sedmelluq.discord.lavaplayer.player.AudioPlayer
import com.sedmelluq.discord.lavaplayer.player.AudioPlayerManager
import net.dv8tion.jda.api.entities.TextChannel
import net.dv8tion.jda.api.entities.VoiceChannel
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

class GuildMusicManager(audioPlayerManager: AudioPlayerManager, context: MessageReceivedEvent) {
  val player: AudioPlayer = audioPlayerManager.createPlayer()
  val trackScheduler: TrackScheduler
  val idGuild = context.guild.idLong
  val jdaLavaConfig: AudioPlayerSendHandler = AudioPlayerSendHandler(player)
  val defaultChannel: TextChannel = context.textChannel

  init {
    trackScheduler = TrackScheduler(player)
    player.addListener(trackScheduler)
  }
}