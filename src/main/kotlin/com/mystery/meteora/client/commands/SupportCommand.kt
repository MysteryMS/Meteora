package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("Support", "utils")

class SupportCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  @Command("support", "sup", "server")
  fun support() {
    context.author.openPrivateChannel().queue { channel ->
      channel.sendMessage("invite.description".translate(config, context.guild.id)).queue()
    }
  }
}