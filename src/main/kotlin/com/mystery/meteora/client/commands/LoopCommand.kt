package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("loop", "music")

class LoopCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("loop", "repeat")
  fun loop() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    val embed = EmbedBuilder()
      .setColor(Color(59, 136, 195))
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing").queue()
      PlayerController(context).manager.trackScheduler.loop -> {
        embed.setDescription("🔁 – Loop disabled")
        context.channel.sendMessage(embed.build()).queue()
        PlayerController(context).manager.trackScheduler.loop()
      }
      !PlayerController(context).manager.trackScheduler.loop -> {
        embed.setDescription("🔂 – Loop enabled")
        context.channel.sendMessage(embed.build()).queue()
        PlayerController(context).manager.trackScheduler.loop()
      }
    }
  }
}