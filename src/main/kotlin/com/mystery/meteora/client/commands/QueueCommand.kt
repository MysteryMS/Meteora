package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.MusicScheduler
import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.model.Parser
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Queue", "music")

class QueueCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("queue", "q", "fila")
  fun queue() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    val trackSchedulerQueue = PlayerController(context).manager.trackScheduler.queue
    val removeAliases = mutableListOf("drop", "remove", "delete", "exclude", "r")
    val args = args.split(' ')
    when {
      guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config, context.guild.id)).queue()
      trackSchedulerQueue.size == 0 -> context.channel.sendMessage("global.noTrack".translate(config, context.guild.id)).queue()
      removeAliases.contains(args[0]) -> {
        if (args[1] == "") {
          context.channel.sendMessage("queue.invalidPosition".translate(config, context.guild.id, prefix))
          return
        }
        try {
          val position = args[1].toInt() - 1
          if (position > trackSchedulerQueue.size || position < 1) {
            context.channel.sendMessage("queue.rangeError".translate(config, context.guild.id))
            return
          }
          val element: MusicScheduler = trackSchedulerQueue.toArray()[position] as MusicScheduler
          trackSchedulerQueue.remove(element)
          val embed = EmbedBuilder()
            .setDescription("queue.dropped".translate(config, context.guild.id, element.track.info.title))
            .setColor(Color(59, 136, 195))
          context.channel.sendMessage(embed.build()).queue()
        } catch (e: NumberFormatException) {
          context.channel.sendMessage("global.input.numberError".translate(config, context.guild.id)).queue()
        }
      }
      else -> {
        val queueString = trackSchedulerQueue.mapIndexed { i, track ->
          "[${i + 1}] \"${track.track.info.title}\" by \"${track.track.info.author}\" (${Parser().parse(track.track.info.length)})"
        }
        var totalLength: Long = 0
        trackSchedulerQueue.forEach { element -> totalLength += element.track.duration}
        context.channel.sendMessage("queue.queue".translate(config, context.guild.id, context.guild.name, queueString, trackSchedulerQueue.size, Parser().parse(totalLength)))
          .queue()
      }
    }
  }
}