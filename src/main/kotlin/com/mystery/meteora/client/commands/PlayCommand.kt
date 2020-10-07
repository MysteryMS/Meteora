package com.mystery.meteora.client.commands

import com.mystery.meteora.MeteoraKt
import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.StateController
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("PlayCommand", "music")
@Usage("play.usage")
@Description("play.description")

class PlayCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  companion object {
    val map = mutableMapOf<String, MessageReceivedEvent>()
  }
  @Command("play", "p")
  fun play() {
    if (args == "") {
      Helper().explain(context, "play", "PlayCommand", prefix, config!!)
      return
    }
    if (!context.member?.voiceState?.inVoiceChannel()!!) {
      context.channel.sendMessage(
        "play.notInVoiceChannel".translate(
          config,
          context.guild.id,
          context.author.asMention
        )
      ).queue()
    } else {
      if (args.split(' ')[0] == "-f") {
        val state = StateController.getState()
        val embed = EmbedBuilder()
          .setDescription("play.deezer".translate(config, context.guild.id, "https://connect.deezer.com/oauth/auth.php?app_id=436102&redirect_uri=http://localhost:4210/deezer&perms=basic_access&state=$state"))
          .build()
        map[state] = context
        context.channel.sendMessage(embed).queue()
        return
      }
      PlayerController(context).play(args)
    }
  }
}