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

@Module("StopCommand", "music")

class StopCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("stop")
  fun stop() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing in this server.").queue()
      else -> {
        if (DJController().hasDjRole(context, true) != null && !DJController().hasDjRole(context, true)!! ) {
          context.channel.sendMessage("❌ – Only members with the DJ role, admin permission or the track's requester can use this command.").queue()
        }
        val embed = EmbedBuilder()
        embed.setDescription("⏹ – Player stopped")
        embed.setColor(Color(59, 136, 195))
        PlayerController(context).manager.trackScheduler.stop(context.guild)
        val player = PlayerController.findManager(context.guild.idLong)
        PlayerController.guildsMusic.remove(player)
        context.channel.sendMessage(embed.build()).queue()
      }
    }
  }
}