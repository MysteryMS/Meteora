package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("SkipCommand", "music")

class SkipCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("skip")
  fun skip() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing in this server.").queue()
      else -> {
        val embed = EmbedBuilder()
        val controller = PlayerController(context).manager.trackScheduler
        embed.setDescription("⏭️ – Music Skipped")
        embed.setColor(Color(59, 136, 195))
        if (guildPlayer.trackScheduler.loop && controller.queue.size == 0) {
          guildPlayer.player.playingTrack.position = 0
          context.channel.sendMessage(embed.build()).queue()
          return
        }
        if (controller.queue.size == 0) {
          context.channel.sendMessage(embed.build()).queue()
          controller.stop(context.guild)
          PlayerController.guildsMusic.remove(guildPlayer)
        } else {
          context.channel.sendMessage(embed.build()).queue()
          controller.next()
        }
      }
    }
  }
}