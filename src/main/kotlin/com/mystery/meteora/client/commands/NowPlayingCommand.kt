package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.model.Parser
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("Now Playing", "music")

class NowPlayingCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("nowplaying", "np")
  fun now() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    when {
      guildPlayer == null -> context.channel.sendMessage("There is no active players in this server.").queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing in this server.").queue()
      else -> {
        val track = guildPlayer.player.playingTrack
        val embed = EmbedBuilder()
          .setTitle("Current track", track.info.uri)
          .addField("Name", track.info.title, true)
          .addField("Length", Parser().parse(track.duration), false)
          .addField("Author", track.info.author, true)
          .addField("Is Stream?", track.info.isStream.toString(), true)
        context.channel.sendMessage(embed.build()).queue()
      }
    }
  }
}