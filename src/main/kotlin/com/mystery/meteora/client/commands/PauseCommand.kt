package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.DJController
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("playpause", "music")

class PauseCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  private val guildPlayer = PlayerController.findManager(context.guild.idLong)

  @Command("pause")
  fun pause() {
    when {
      guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config, context.guild.id)).queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage(
        "global.noTrack".translate(
          config,
          context.guild.id
        )
      ).queue()
      guildPlayer.player.isPaused -> {
        val embed = EmbedBuilder()
          .setDescription("paused.alreadyPaused".translate(config, context.guild.id, prefix))
          .setColor(Color(59, 136, 195))
        context.channel.sendMessage(embed.build()).queue()
      }
      else -> {
        if (DJController().hasDjRole(context, true) != null && !DJController().hasDjRole(context, true)!!) {
          context.channel.sendMessage("global.djRole".translate(config, context.guild.id)).queue()
          return
        }
        context.channel.sendMessage(
          EmbedBuilder().setDescription("pause.paused".translate(config, context.guild.id))
            .setColor(Color(59, 136, 195)).build()
        ).queue()
        guildPlayer.player.isPaused = true
      }
    }
  }

  @Command("resume")
  fun resume() {
    when {
      guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config, context.guild.id))
      !guildPlayer.player.isPaused -> {
        val embed = EmbedBuilder()
          .setDescription("resume.alreadyResumed".translate(config, context.guild.id))
          .setColor(Color(59, 136, 195))
        context.channel.sendMessage(embed.build()).queue()
      }
      else -> {
        if (DJController().hasDjRole(context, true) != null && !DJController().hasDjRole(context, true)!!) {
          context.channel.sendMessage("global.alternativeDjOnly".translate(config, context.guild.id)).queue()
          return
        }
        context.channel.sendMessage(
          EmbedBuilder().setDescription("resume.resumed".translate(config, context.guild.id))
            .setColor(Color(59, 136, 195)).build()
        ).queue()
        guildPlayer.player.isPaused = false
      }
    }
  }
}