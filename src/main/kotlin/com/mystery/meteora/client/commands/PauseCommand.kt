package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.DJController
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("playpause", "music")

class PauseCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  private val guildPlayer = PlayerController.findManager(context.guild.idLong)
  @Command("pause")
  fun pause() {
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing in this server.").queue()
      guildPlayer.player.isPaused -> {
        val embed = EmbedBuilder()
          .setDescription("The player is already paused. Did you mean to resume the track? Use `${prefix}resume` instead.")
          .setColor(Color(59, 136, 195))
        context.channel.sendMessage(embed.build()).queue()
      }
      else -> {
        if (DJController().hasDjRole(context, true) != null && !DJController().hasDjRole(context, true)!!) {
          context.channel.sendMessage("❌ – Only members with the DJ role or the track's requester can use this command.").queue()
          return
        }
        context.channel.sendMessage(EmbedBuilder().setDescription("⏸ – Track paused").setColor(Color(59, 136, 195)).build()).queue()
        guildPlayer.player.isPaused = true
      }
    }
  }

  @Command("resume")
  fun resume() {
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.")
      !guildPlayer.player.isPaused -> {
        val embed = EmbedBuilder()
          .setDescription("The player is already resumed. Did you mean to pause the track? Use `${prefix}pause` instead.")
          .setColor(Color(59, 136, 195))
        context.channel.sendMessage(embed.build()).queue()
      } else -> {
      if (DJController().hasDjRole(context, true) != null && !DJController().hasDjRole(context, true)!!) {
        context.channel.sendMessage("❌ – Only members with the DJ role, admin permission or the track's requester can use this command.").queue()
        return
      }
      context.channel.sendMessage(EmbedBuilder().setDescription("▶ – Track resumed").setColor(Color(59, 136, 195)).build()).queue()
      guildPlayer.player.isPaused = false
    }
    }
  }
}