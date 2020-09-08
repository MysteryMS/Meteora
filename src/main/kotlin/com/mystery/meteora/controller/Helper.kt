package com.mystery.meteora.controller

import com.mystery.meteora.handler.Handler
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Usage
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import kotlin.reflect.full.findAnnotation

class Helper {
  fun explain(context: MessageReceivedEvent, commandName: String, moduleName: String, prefix: String, config: Config) {
    val modules = Handler.modules.find { module -> module.name == moduleName }
    val command = modules?.commands?.find { c -> c.names.contains(commandName) }
    val description = modules?.moduleClass?.findAnnotation<Description>()?.description
    val usage = modules?.moduleClass?.findAnnotation<Usage>()?.usage
    val unusedLabels = command?.names?.filter { name -> name != commandName }
    val labels = if (unusedLabels?.isEmpty()!!) {
      "helper.aliases".translate(config, context.guild.id)
    } else {
      unusedLabels.joinToString(", ") { element -> "`${prefix}$element`" }
    }
    val embed = EmbedBuilder()
      .setTitle("helper.commandUsage".translate(config, context.guild.id))
      .setDescription(description!!.translate(config, context.guild.id))
      .addField("helper.usage".translate(config, context.guild.id), "`${prefix}${commandName} " + "${usage?.translate(config, context.guild.id, usage)}`", false)
      .addField("helper.aliases".translate(config, context.guild.id), labels, false)
    context.channel.sendMessage(embed.build()).queue()
  }
}
