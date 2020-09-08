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

@Module("Forward", "music")
@Usage("forward.usage")
@Description("forward.description")

class ForwardCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("forward", "fw", "fwd")
  fun forward() {
    if (args == "") {
      Helper().explain(context, "forward", "Forward", prefix, config!!)
      return
    }
    try {
      val guildPlayer = PlayerController.findManager(context.guild.idLong)
      val time = args.split(' ')[0].toLong()
      when {
        guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config!!, context.guild.id)).queue()
        guildPlayer.player.playingTrack == null -> context.channel.sendMessage("global.noTrack".translate(config!!, context.guild.id)).queue()
        else -> {
          val embed = EmbedBuilder()
            .setDescription("forward.forwarded".translate(config!!, context.guild.id, time))
            .setColor(Color(59, 136, 195))
          context.channel.sendMessage(embed.build()).queue()
          guildPlayer.player.playingTrack.position = guildPlayer.player.playingTrack.position + (time * 1000)
        }
      }
    } catch (error: NumberFormatException) {
      context.channel.sendMessage("global.number.inputError".translate(config!!, context.guild.id)).queue()
    }
  }

  @Command("rewind", "rw", "rwd")
  fun rewind() {
    if (args == "") {
      Helper().explain(context, "rewind", "Forward", prefix, config!!)
      return
    }
    try {
      val guildPlayer = PlayerController.findManager(context.guild.idLong)
      val time = args.split(' ')[0].toLong()
      when {
        guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config!!, context.guild.id)).queue()
        guildPlayer.player.playingTrack == null -> context.channel.sendMessage("global.noTrack".translate(config!!, context.guild.id)).queue()
        time > guildPlayer.player.playingTrack.position -> PlayerController(context).manager.trackScheduler.next()
        else -> {
          val embed = EmbedBuilder()
            .setDescription("rewind.rewound".translate(config!!, context.guild.id, time.toString()))
            .setColor(Color(59, 136, 195))
          context.channel.sendMessage(embed.build()).queue()
          guildPlayer.player.playingTrack.position = guildPlayer.player.playingTrack.position - (time * 1000)
        }
      }
    } catch (error: NumberFormatException) {
      context.channel.sendMessage("global.number.inputError".translate(config!!, context.guild.id)).queue()
    }
  }

}