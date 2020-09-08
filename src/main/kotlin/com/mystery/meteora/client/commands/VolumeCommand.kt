package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.translate
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
      context.channel.sendMessage("global.noPlayer".translate(config, context.guild.id)).queue()
    } else {
      try {
        val playerVolume = PlayerController(context).manager.player.volume
        val volume = args.toInt()
        if (volume in 0..150) {
          if (volume == 0) string = "volume.muted".translate(config, context.guild.id)
          if (volume > playerVolume && volume != 0) string = "volume.up".translate(config, context.guild.id, volume)
          if (volume < playerVolume && volume != 0) string = "volume.down".translate(config, context.guild.id, volume)
          if (volume == playerVolume) string = "volume.noEffect".translate(config, context.guild.id)
          val embed = EmbedBuilder()
            .setDescription(string)
            .setColor(Color(204, 214, 221))
          PlayerController(context).manager.player.volume = args.toInt()
          context.channel.sendMessage(embed.build()).queue()
        } else {
          context.channel.sendMessage("volume.rangeError".translate(config, context.guild.id)).queue()
        }
      } catch (error: NumberFormatException) {
        context.channel.sendMessage("global.number.inputError".translate(config, context.guild.id)).queue()
      }
    }
  }
}