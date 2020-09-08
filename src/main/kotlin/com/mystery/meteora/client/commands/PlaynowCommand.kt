package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.DJController
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("Playnow", "music")
@Usage("playnow.usage")
@Description("playnow.description")

class PlaynowCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("playnow", "pn", "tocaragora")
  fun playnow() {
    if (args == "") {
      Helper().explain(context, "playnow", "Playnow", prefix, config!!)
      return
    }
    if (!context.member?.voiceState?.inVoiceChannel()!!) {
      context.channel.sendMessage("Hey, ${context.author.asMention}, you must be in a voice channel before running this command!").queue()
    } else if (!DJController().hasDjRole(context, false)!!) {
      context.channel.sendMessage("❌ – Only members with the DJ role or admin permission can use this command.").queue()
      return
    } else {
      PlayerController(context).playNow(args)
    }
  }
}