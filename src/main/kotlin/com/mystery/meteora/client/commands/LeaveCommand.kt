package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Leave", "music")

class LeaveCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("leave", "dc", "quit", "disconnect")
  fun leave() {
    val guildPlayer = PlayerController.findManager(context.guild.idLong)
    if (guildPlayer == null) {
      context.channel.sendMessage("There isn't an active player in this server.").queue()
    } else {
      val channel = context.guild.members.find { member -> member.idLong == context.jda.selfUser.idLong }?.voiceState?.channel?.name
      val player = PlayerController.findManager(context.guild.idLong)
      val embed = EmbedBuilder()
        .setDescription("<:voiceleave:561612800804388914> – Left `🔉 $channel`")
        .setColor(Color(217, 63, 63))
      PlayerController(context).manager.trackScheduler.stop(context.guild)
      context.channel.sendMessage(embed.build()).queue()
      PlayerController.guildsMusic.remove(player)
    }
  }
}