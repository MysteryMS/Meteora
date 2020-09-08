package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Volume", "music")
@Description("volume.description")
@Usage("volume.usage")

class VolumeCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("volume", "vol")
  fun volume() {
    if (args == "") {
      Helper().explain(context, "volume", "Volume", prefix, config!!)
      return
    }
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    var string = ""
    if (guildPlayer == null) {
      context.channel.sendMessage("There isn't an active player in this server.").queue()
    } else {
      try {
        val playerVolume = PlayerController(context).manager.player.volume
        val volume = args.toInt()
        if (volume in 0..150) {
          if (volume == 0) string = "🔇 – Player muted"
          if (volume > playerVolume && volume != 0) string = "🔊 – Turning the volume up to `${volume}/150`"
          if (volume < playerVolume && volume != 0) string = "🔉 – Turning the volume down to `${volume}/150`"
          if (volume == playerVolume) string = "The volume is the same – the command didn't have effect"
          val embed = EmbedBuilder()
            .setDescription(string)
            .setColor(Color(204, 214, 221))
          PlayerController(context).manager.player.volume = args.toInt()
          context.channel.sendMessage(embed.build()).queue()
        } else {
          context.channel.sendMessage("The volume value _**must**_ be between 0 and 150.").queue()
        }
      } catch (error: NumberFormatException) {
        context.channel.sendMessage("Oops! Seems like your input is not a number.").queue()
      }
    }
  }
}