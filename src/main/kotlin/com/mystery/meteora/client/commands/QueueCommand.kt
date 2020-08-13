package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.MusicScheduler
import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.model.Parser
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import com.sedmelluq.discord.lavaplayer.tools.DataFormatTools
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.litote.kmongo.json
import java.awt.Color
import java.time.format.DateTimeFormatter

@Module("Queue", "music")

class QueueCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("queue", "q", "fila")
  fun queue() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    val trackSchedulerQueue = PlayerController(context).manager.trackScheduler.queue
    val removeAliases = mutableListOf("drop", "remove", "delete", "exclude", "r")
    val args = args.split(' ')
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
      trackSchedulerQueue.size == 0 -> context.channel.sendMessage("There is no tracks in the queue.").queue()
      removeAliases.contains(args[0]) -> {
        if (args[1] == "") {
          context.channel.sendMessage("You must provide the track position findable in `${prefix}queue`")
          return
        }
        try {
          val position = args[1].toInt() - 1
          if (position > trackSchedulerQueue.size || position < 1) {
            context.channel.sendMessage("Provided position is out of the queue length")
            return
          }
          val element: MusicScheduler = trackSchedulerQueue.toArray()[position] as MusicScheduler
          trackSchedulerQueue.remove(element)
          val embed = EmbedBuilder()
            .setDescription("🚮 – Removed `${element.track.info.title}` from the queue")
            .setColor(Color(59, 136, 195))
          context.channel.sendMessage(embed.build()).queue()
        } catch (e: NumberFormatException) {
          context.channel.sendMessage("Oops! Seems like your input is not a number.").queue()
        }
      }
      else -> {
        val queueString = trackSchedulerQueue.mapIndexed { i, track ->
          "[${i + 1}] \"${track.track.info.title}\" by \"${track.track.info.author}\" (${Parser().parse(track.track.info.length)})"
        }
        var totalLength: Long = 0
        trackSchedulerQueue.forEach { element -> totalLength += element.track.duration}
        context.channel.sendMessage("```ini\n-> Queue for ${context.guild.name} <-\n\n${queueString.joinToString("\n")}\n\n${trackSchedulerQueue.size} items in the queue | ${Parser().parse(totalLength)} in total```")
          .queue()
      }
    }
  }
}