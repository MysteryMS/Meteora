package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("PlayCommand", "music")
@Usage("<search-query or link>")

class PlayCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("play", "p")
  fun play() {
    if (args == "") {
      Helper().explain(context, "play", "PlayCommand", prefix)
      return
    }
    if (!context.member?.voiceState?.inVoiceChannel()!!) {
      context.channel.sendMessage("Hey, ${context.author.asMention}, you must be in a voice channel before running this command!").queue()
    } else {
      PlayerController(context).play(args)
    }
  }
}