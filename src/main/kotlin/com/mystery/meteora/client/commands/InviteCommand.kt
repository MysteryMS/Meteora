package com.mystery.meteora.client.commands

import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("invite", "util")

class InviteCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("invite")
  fun invite() {
    val embed = EmbedBuilder()
      .setDescription("So you wanna invite me to your server? Thanks! Just click [here](https://discordapp.com/oauth2/authorize?client_id=464304679128530954&permissions=0&scope=bot) to open the link.")
      .setColor(Color(242, 65, 116))
    context.channel.sendMessage(embed.build()).queue()
  }
}