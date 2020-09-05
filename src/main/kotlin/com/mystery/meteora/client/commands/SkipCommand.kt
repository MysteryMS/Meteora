package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.DJController
import com.mystery.meteora.controller.model.Guilds
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import kotlinx.coroutines.*
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.litote.kmongo.KMongo
import org.litote.kmongo.findOneById
import org.litote.kmongo.getCollection
import java.awt.Color
import kotlin.math.roundToInt

@Module("SkipCommand", "music")

class SkipCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  companion object {
    val guilds: MutableList<Long> = mutableListOf()
  }
  @Command("skip")
  fun skip() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    when {
      guildPlayer == null -> context.channel.sendMessage("There isn't an active player in this server.").queue()
      guildPlayer.player.playingTrack == null -> context.channel.sendMessage("There isn't an active track playing in this server.").queue()
      else -> {
        val client = KMongo.createClient(Config("./meteora.json").config?.databaseConfig?.connectionUri!!)
        val database = client.getDatabase("meteora")
        val collection = database.getCollection<Guilds>()
        val djRoleId = collection.findOneById(context.guild.id)!!.djRole
        val role = context.guild.roles.find { role -> role.idLong == djRoleId }
        if (role == null) {
          skipTrack()
          return
        }
        if (DJController().hasDjRole(context, true)!!) {
          skipTrack()
        } else {
          var shouldDie = false
          val members = PlayerController(context).manager.agreedMembers
          if (!guilds.contains(context.guild.idLong)) {
            guilds.add(context.guild.idLong)
            GlobalScope.launch {
              delay(40000)
              if (shouldDie) return@launch
              context.channel.sendMessage("❌ – Vote-skip timed out").queue()
              members.clear()
              guilds.remove(context.guild.idLong)
            }
          }
          val voiceChannelMembers = context.member!!.voiceState?.channel?.members?.size!! - 1
          val reqMembers: Int = ((voiceChannelMembers * (70.0f/100.0f)).roundToInt())
          if (members.contains(context.member!!)) return
          members.add(context.member!!)
          context.channel.sendMessage("Vote-skip started! **$reqMembers** members required, **${reqMembers - members.size}** left").queue()
          if (members.size == reqMembers) {
            skipTrack()
            shouldDie = true
          }
        }
      }
    }
  }
  val controller = PlayerController(context).manager.trackScheduler
  private val guildPlayer = PlayerController.findManager(context.guild.idLong)
  val members = PlayerController(context).manager.agreedMembers
  val embed = EmbedBuilder()
    .setDescription("⏭️ – Music Skipped")
    .setColor(Color(59, 136, 195))
  private fun skipTrack() {
    if (controller.queue.size == 0) {
      if (guildPlayer!!.trackScheduler.loop) {
        guildPlayer.player.playingTrack.position = 0
        context.channel.sendMessage(embed.build()).queue()
        return
      }
      context.channel.sendMessage(embed.build()).queue()
      controller.stop(context.guild)
      PlayerController.guildsMusic.remove(guildPlayer)
      members.clear()
    } else {
      context.channel.sendMessage(embed.build()).queue()
      controller.next()
      members.clear()
    }
  }
}