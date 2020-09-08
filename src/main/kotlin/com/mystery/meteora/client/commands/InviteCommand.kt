package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("invite", "util")

class InviteCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("invite")
  fun invite() {
    val embed = EmbedBuilder()
      .setDescription("invite.description".translate(config!!, context.guild.id))
      .setColor(Color(242, 65, 116))
    context.channel.sendMessage(embed.build()).queue()
  }
}