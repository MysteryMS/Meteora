package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.DJController
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("Playnow", "music")
@Usage("<search-query or link>")
class PlaynowCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("playnow", "pn", "tocaragora")
  fun playnow() {
    if (args == "") {
      context.channel.sendMessage("esqueceu")
      return
    }
    if (!context.member?.voiceState?.inVoiceChannel()!!) {
      context.channel.sendMessage("Hey, ${context.author.asMention}, you must be in a voice channel before running this command!").queue()
    } else if (!DJController().hasDjRole(context, false)) {
      context.channel.sendMessage("❌ – Only members with the DJ role or admin permission can use this command.").queue()
      return
    } else {
      PlayerController(context).playNow(args)
    }
  }
}