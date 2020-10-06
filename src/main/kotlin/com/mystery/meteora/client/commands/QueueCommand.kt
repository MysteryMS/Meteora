package com.mystery.meteora.client.commands

import com.mystery.meteora.client.QueueObject
import com.mystery.meteora.client.lavaPlayer.MusicScheduler
import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.PaginatorController
import com.mystery.meteora.controller.model.Parser
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Queue", "music")

class QueueCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  companion object {
    val pages: MutableMap<Long, QueueObject> = mutableMapOf()
  }

  @Command("queue", "q", "fila")
  fun queue() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    val trackSchedulerQueue = PlayerController(context).manager.trackScheduler.queue
    val removeAliases = mutableListOf("drop", "remove", "delete", "exclude", "r")
    val args = args.split(' ')
    when {
      guildPlayer == null -> context.channel.sendMessage("global.noPlayer".translate(config, context.guild.id)).queue()
      trackSchedulerQueue.size == 0 -> context.channel.sendMessage("global.noTrack".translate(config, context.guild.id))
        .queue()
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
        if (trackSchedulerQueue.size > 15) {
          if (pages[context.guild.idLong] != null) {
            pages.remove(context.guild.idLong)
          }
          val list: MutableList<String> = mutableListOf()
          val header = "Perereca"
          val footer = "xumbinoh"
          var size = 0
          var items = ""
          trackSchedulerQueue.forEachIndexed { index, ms ->
            items += "[${index + 1}] \"${ms.track.info.title}\" | ${ms.track.info.author} (${Parser().parse(ms.track.info.length)})\n"
            size++
            if (size == 15) {
              val finalString = "```\n$header\n$items\n$footer```"
              list.add(finalString)
              size = 0
              items = ""
            }
          }
          context.channel.sendMessage(list[0]).queue { message ->
            pages[message.guild.idLong] = QueueObject(message.idLong, list)
            message.addReaction("⬅️").queue()
            message.addReaction("➡️").queue()
            GlobalScope.launch {
              delay(15000)
              pages.remove(message.guild.idLong)
              PaginatorController.guilds.remove(message.guild.idLong)
               message.clearReactions().queue()
            }
          }
          return
        }
        val queueString = trackSchedulerQueue.mapIndexed { i, track ->
          "[${i + 1}] \"${track.track.info.title}\" | \"${track.track.info.author}\" (${Parser().parse(track.track.info.length)})"
        }
        var totalLength: Long = 0
        trackSchedulerQueue.forEach { element -> totalLength += element.track.duration }
        context.channel.sendMessage(
          "queue.queue".translate(
            config,
            context.guild.id,
            context.guild.name,
            queueString,
            trackSchedulerQueue.size,
            Parser().parse(totalLength)
          )
        )
          .queue()
      }
    }
  }
}