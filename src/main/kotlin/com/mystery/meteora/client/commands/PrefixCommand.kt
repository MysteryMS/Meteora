package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.model.Guilds
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.litote.kmongo.*

@Module("Prefix", "management")
@Description("Changes the current bot prefix.")
@Usage("<prefix>")

class PrefixCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("prefix")
  fun prefix() {
    val permission = context.member?.hasPermission(Permission.MESSAGE_MANAGE)
    if (!permission!!) {
      context.channel.sendMessage("In order to run this command, you need the `Manage Messages` permission!").queue()
      return
    }
    if (args == "") {
      Helper().explain(context, "prefix", "Prefix", prefix)
      return
    }
    val argsArray = args.split(' ').toTypedArray()
    val prefix = argsArray[0]
    if (prefix.length > 3) {
      context.channel.sendMessage("The prefix is limited to 3 characters.").queue()
    } else {
      val client =
        KMongo.createClient()
      val database = client.getDatabase("meteora")
      val collection = database.getCollection("guild")
      collection.updateOne(Guilds::_id eq context.guild.id, Guilds::prefix setTo prefix)
      context.channel.sendMessage("Successfully changed the prefix to `$prefix`.").queue()
      client.close()
    }
  }
}