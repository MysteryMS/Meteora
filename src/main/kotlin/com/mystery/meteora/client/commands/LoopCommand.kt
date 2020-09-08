package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("loop", "music")

class LoopCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("loop", "repeat", "rp", "r")
  fun loop() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    val embed = EmbedBuilder()
      .setColor(Color(59, 136, 195))
    when {
      guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config!!, context.guild.id)).queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("global.noTrack".translate(config!!, context.guild.id)).queue()
      PlayerController(context).manager.trackScheduler.loop -> {
        embed.setDescription("loop.off".translate(config!!, context.guild.id))
        context.channel.sendMessage(embed.build()).queue()
        PlayerController(context).manager.trackScheduler.loop()
      }
      !PlayerController(context).manager.trackScheduler.loop -> {
        embed.setDescription("loop.on".translate(config!!, context.guild.id))
        context.channel.sendMessage(embed.build()).queue()
        PlayerController(context).manager.trackScheduler.loop()
      }
    }
  }
}