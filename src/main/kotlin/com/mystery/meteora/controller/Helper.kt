package com.mystery.meteora.controller

import com.mystery.meteora.handler.Handler
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Usage
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import kotlin.reflect.full.findAnnotation

class Helper {
  fun explain(context: MessageReceivedEvent, commandName: String, moduleName: String, prefix: String) {
    val modules = Handler.modules.find { module -> module.name == moduleName }
    val command = modules?.commands?.find { c -> c.names.contains(commandName) }
    val description = modules?.moduleClass?.findAnnotation<Description>()?.description
    val usage = modules?.moduleClass?.findAnnotation<Usage>()?.usage
    val unusedLabels = command?.names?.filter { name -> name != commandName }
    val labels = if (unusedLabels?.isEmpty()!!) {
      "No aliases."
    } else {
      unusedLabels.joinToString(", ") { element -> "`${prefix}$element`" }
    }
    val embed = EmbedBuilder()
      .setTitle("⁉️ – Command usage")
      .setDescription(description)
      .addField("\uD83D\uDC69\u200D\uD83C\uDFEB – Usage", "`${prefix}${commandName} $usage`", false)
      .addField("🔀 – Aliases", labels, false)
    context.channel.sendMessage(embed.build()).queue()
  }
}
