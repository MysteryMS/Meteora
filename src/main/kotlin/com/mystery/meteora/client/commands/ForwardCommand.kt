package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Forward", "music")
@Usage("<time-in-seconds>")
@Description("Sets the current time of a music, forwarding or rewinding it")

class ForwardCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("forward", "fw", "fwd")
  fun forward() {
    if (args == "") {
      Helper().explain(context, "forward", "Forward", prefix)
      return
    }
    try {
      val guildPlayer = PlayerController.findManager(context.guild.idLong)
      val time = args.split(' ')[0].toLong()
      when {
        guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
        guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing in this server.").queue()
        else -> {
          val embed = EmbedBuilder()
            .setDescription("⏩ – Track forwarded in $time seconds")
            .setColor(Color(59, 136, 195))
          context.channel.sendMessage(embed.build()).queue()
          guildPlayer.player.playingTrack.position = guildPlayer.player.playingTrack.position + (time * 1000)
        }
      }
    } catch (error: NumberFormatException) {
      context.channel.sendMessage("Oops! Seems like your input is not a number.").queue()
    }
  }

  @Command("rewind", "rw", "rwd")
  fun rewind() {
    if (args == "") {
      Helper().explain(context, "rewind", "Forward", prefix)
      return
    }
    try {
      val guildPlayer = PlayerController.findManager(context.guild.idLong)
      val time = args.split(' ')[0].toLong()
      when {
        guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
        guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing in this server.").queue()
        time > guildPlayer.player.playingTrack.position -> PlayerController(context).manager.trackScheduler.next()
        else -> {
          val embed = EmbedBuilder()
            .setDescription(":rewind: – Track rewound in $time seconds")
            .setColor(Color(59, 136, 195))
          context.channel.sendMessage(embed.build()).queue()
          guildPlayer.player.playingTrack.position = guildPlayer.player.playingTrack.position - (time * 1000)
        }
      }
    } catch (error: NumberFormatException) {
      context.channel.sendMessage("Oops! Seems like your input is not a number.").queue()
    }
  }

}