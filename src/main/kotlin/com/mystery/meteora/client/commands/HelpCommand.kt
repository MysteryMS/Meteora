package com.mystery.meteora.client.commands

import com.mystery.meteora.handler.Handler
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Help", "util")

class HelpCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("help", "h")
  fun help() {
    val embed = EmbedBuilder()
      .setTitle("Hey there, ${context.author.name}. Here's a list with all my commands!")
    val musicCommands = Handler.modules.filter { command -> command.category == "music" }
      .map { command -> "`$prefix${command.commands[0].names[0]}`" }
    val musicCmds = musicCommands.joinToString(", ")
    val utilCommands = Handler.modules.filter { command -> command.category == "util" }
      .map { command -> "`$prefix${command.commands[0].names[0]}`" }
    val utilCmds = utilCommands.joinToString(", ")
    val managementCommands = Handler.modules.filter { command -> command.category == "management" }
      .map { command -> "`$prefix${command.commands[0].names[0]}`" }
    val mgCommand = managementCommands.joinToString(", ")
    embed.addField("Music (${musicCommands.size})", musicCmds, false)
    embed.addField("Utils (${utilCommands.size})", utilCmds, false)
    embed.addField("Management (${managementCommands.size})", mgCommand, false)
    embed.setColor(Color(242, 65, 116))
    context.channel.sendMessage(embed.build()).queue()
  }
}
