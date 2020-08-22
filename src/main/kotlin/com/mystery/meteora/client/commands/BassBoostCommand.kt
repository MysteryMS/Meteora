package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import com.sedmelluq.discord.lavaplayer.filter.equalizer.EqualizerFactory
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Bassboost", "music")

class BassBoostCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("bassboost", "bb")
  fun bass() {
    val scheduler = PlayerController(context).manager.trackScheduler
    val equalizer = EqualizerFactory()
    if (!scheduler.bassBoost) {
      scheduler.bass(true)
      val embed = EmbedBuilder()
        .setDescription("🥁 – Bass boost activated—hold tight!")
        .setColor(Color(157, 5, 34))
      context.channel.sendMessage(embed.build()).queue()
      PlayerController(context).manager.player.setFilterFactory(equalizer)
      for (i in 1..3) {
        equalizer.setGain(i, 0.6F)
      }
    } else {
      PlayerController(context).manager.player.setFilterFactory(null)
      val embed = EmbedBuilder()
        .setDescription("🥁 – Bass boost deactivated")
        .setColor(Color(157, 5, 34))
      context.channel.sendMessage(embed.build()).queue()
    }
  }

}