package com.mystery.meteora.client.commands

import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.DJController
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

@Module("Leave", "music")

class LeaveCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("leave", "dc", "quit", "disconnect", "sair")
  fun leave() {
    when (PlayerController.findManager(context.guild.idLong)) {
      null -> {
        context.channel.sendMessage("There isn't an active player in this server.").queue()
      }
      else -> {
        if (DJController().hasDjRole(context, false) != null && (!DJController().hasDjRole(context, false)!! || PlayerController(context).manager.player.playingTrack != null)) {
          context.channel.sendMessage("global.djOnlyWithoutAuthor".translate(config!!, context.guild.id)).queue()
          return
        }
        val channel = context.guild.members.find { member -> member.idLong == context.jda.selfUser.idLong }?.voiceState?.channel?.name
        val player = PlayerController.findManager(context.guild.idLong)
        val embed = EmbedBuilder()
          .setDescription("leave.left".translate(config!!, context.guild.id, channel!!))
          .setColor(Color(217, 63, 63))
        PlayerController(context).manager.trackScheduler.stop(context.guild)
        context.channel.sendMessage(embed.build()).queue()
        PlayerController.guildsMusic.remove(player)
      }
    }
  }
}
