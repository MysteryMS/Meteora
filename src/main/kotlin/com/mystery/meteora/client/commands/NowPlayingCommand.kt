package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.model.Parser
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("Now Playing", "music")

class NowPlayingCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("nowplaying", "np")
  fun now() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    when {
      guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config, context.guild.id)).queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("global.noTrack".translate(config, context.guild.id)).queue()
      else -> {
        val track = guildPlayer.player.playingTrack
        val embed = EmbedBuilder()
          .setTitle("nowplaying.title".translate(config, context.guild.id), track.info.uri)
          .addField("nowplaying.altTitle".translate(config, context.guild.id), track.info.title, true)
          .addField("nowplaying.length".translate(config, context.guild.id), "${Parser().parse(track.position)}/${Parser().parse(track.duration)}", false)
          .addField("nowplaying.author".translate(config, context.guild.id), track.info.author, true)
          .addField("nowplaying.isStream".translate(config, context.guild.id), track.info.isStream.toString(), true)
          .addField("nowplaying.requestedBy".translate(config, context.guild.id), "<@${guildPlayer.trackScheduler.requestedByAuthorId}>", false)
          .setImage("https://i.ytimg.com/vi/${track.info.identifier}/maxresdefault.jpg")
        context.channel.sendMessage(embed.build()).queue()
      }
    }
  }
}