package com.mystery.meteora.client.commands

import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("Support", "utils")

class SupportCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("support", "sup", "server")
  fun support() {
      context.author.openPrivateChannel().queue { channel ->
          channel.sendMessage("Do you need some extra help? Join my support server! https://discord.gg/J2wCMUJ").queue()
      }
   }
}