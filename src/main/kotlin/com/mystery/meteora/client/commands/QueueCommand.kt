package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.model.Parser
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("Queue", "music")

class QueueCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("queue", "q")
  fun queue() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
      PlayerController(context).manager.trackScheduler.queue.size == 0 -> context.channel.sendMessage("There is no tracks in the queue.").queue()
      else -> {
        val queueString = PlayerController(context).manager.trackScheduler.queue.mapIndexed { i, track -> "[${i + 1 }] \"${track.track.info.title}\" by \"${track.track.info.author}\" (${Parser().parse(track.track.info.length)})"}
        context.channel.sendMessage("```ini\n-> Queue for ${context.guild.name} <-\n\n${queueString.joinToString("\n")}```").queue()
      }
    }
  }
}