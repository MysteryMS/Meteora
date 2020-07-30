package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("StopCommand", "music")

class StopCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("stop")
  fun stop() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing in this server.").queue()
      else -> {
        val embed = EmbedBuilder()
        embed.setDescription("⏹ – Player stopped")
        embed.setColor(Color(59, 136, 195))
        PlayerController(context).manager.trackScheduler.stop(context.guild)
        context.channel.sendMessage(embed.build()).queue()
      }
    }
  }
}