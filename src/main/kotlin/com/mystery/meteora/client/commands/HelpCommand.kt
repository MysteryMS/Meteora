package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.Handler
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Help", "util")

class HelpCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("help", "h")
  fun help() {
    val embed = EmbedBuilder()
       .setTitle("help.title".translate(config!!, context.guild.id))
    val musicCommands = Handler.modules.filter { command -> command.category == "music" }
      .map { command -> "`$prefix${command.commands[0].names[0]}`" }
    val musicCmds = musicCommands.joinToString(", ")
    val utilCommands = Handler.modules.filter { command -> command.category == "util" }
      .map { command -> "`$prefix${command.commands[0].names[0]}`" }
    val utilCmds = utilCommands.joinToString(", ")
    val managementCommands = Handler.modules.filter { command -> command.category == "management" }
      .map { command -> "`$prefix${command.commands[0].names[0]}`" }
    val mgCommand = managementCommands.joinToString(", ")
    embed.addField("help.music".translate(config, context.guild.id, musicCommands.size), musicCmds, false)
    embed.addField("help.utils".translate(config, context.guild.id, utilCommands.size), utilCmds, false)
    embed.addField("help.management".translate(config, context.guild.id, managementCommands.size), mgCommand, false)
    embed.setColor(Color(242, 65, 116))
    context.channel.sendMessage(embed.build()).queue()
  }
}
