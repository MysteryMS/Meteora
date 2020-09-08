package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.model.Guilds
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.litote.kmongo.*

@Module("Prefix", "management")
@Description("prefix.description")
@Usage("prefix.usage")

class PrefixCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("prefix")
  fun prefix() {
    val permission = context.member?.hasPermission(Permission.MESSAGE_MANAGE)
    if (!permission!!) {
      context.channel.sendMessage("prefix.insufficientPerms".translate(config, context.guild.id)).queue()
      return
    }
    if (args == "") {
      Helper().explain(context, "prefix", "Prefix", prefix, config!!)
      return
    }
    val argsArray = args.split(' ').toTypedArray()
    val prefix = argsArray[0]
    if (prefix.length > 3) {
      context.channel.sendMessage("prefix.maxValue".translate(config, context.guild.id)).queue()
    } else {
      val client = KMongo.createClient(config!!.config?.databaseConfig?.connectionUri!!)
      val database = client.getDatabase("meteora")
      val collection = database.getCollection("guilds")
      collection.updateOne(Guilds::_id eq context.guild.id, Guilds::prefix setTo prefix)
      context.channel.sendMessage("prefix.changed".translate(config, context.guild.id, prefix)).queue()
      client.close()
    }
  }
}