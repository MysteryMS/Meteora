package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.DJController
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import com.sedmelluq.discord.lavaplayer.filter.equalizer.EqualizerFactory
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Bassboost", "music")

class BassBoostCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  @Command("bassboost", "bb")
  fun bass() {
    val scheduler = PlayerController(context).manager.trackScheduler
    val equalizer = EqualizerFactory()
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    when {
      guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config!!, context.guild.id))
        .queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage(
          "global.noTrack".translate(
              config!!,
              context.guild.id
          )
      ).queue()
      else -> {
        if (DJController().hasDjRole(context, false) != null && !DJController().hasDjRole(context, true)!!) {
          context.channel.sendMessage("global.alternativeDjOnly".translate(config!!, context.guild.id))
            .queue()
        } else {
          if (!scheduler.bassBoost) {
            scheduler.bass(true)
            val embed = EmbedBuilder()
              .setDescription("bassboost.on".translate(config!!, context.guild.id))
              .setColor(Color(157, 5, 34))
            context.channel.sendMessage(embed.build()).queue()
            PlayerController(context).manager.player.setFilterFactory(equalizer)
            for (i in 1..3) {
              equalizer.setGain(i, 0.6F)
            }
          } else {
            PlayerController(context).manager.player.setFilterFactory(null)
            val embed = EmbedBuilder()
              .setDescription("bassboost.off".translate(config!!, context.guild.id))
              .setColor(Color(157, 5, 34))
            context.channel.sendMessage(embed.build()).queue()
          }
        }
      }
    }
  }

}