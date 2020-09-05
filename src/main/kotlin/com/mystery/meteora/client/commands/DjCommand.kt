package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.model.Guilds
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.litote.kmongo.KMongo
import org.litote.kmongo.eq
import org.litote.kmongo.setTo
import org.litote.kmongo.updateOne

@Module("dj", "music")
@Usage("<[role] || [disabled]>")

class DjCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("djrole")
  fun dj() {
    val client = KMongo.createClient(Config("./meteora.json").config?.databaseConfig?.connectionUri!!)
    val database = client.getDatabase("meteora")
    val collection = database.getCollection("guild")
    if (args.split(' ')[0] == "disabled") {
      collection.updateOne(Guilds::_id eq context.guild.id, Guilds::djRole setTo null)
      client.close()
      context.channel.sendMessage("\uD83C\uDFA7 – DJ role disabled.").queue()
      return
    }
    if (args == "") {
      Helper().explain(context, "djrole", "dj", prefix)
      return
    }
    if (context.message.mentionedRoles.isEmpty()) {
      context.channel.sendMessage("You must mention a role!").queue()
      return
    }
    val role = context.message.mentionedRoles[0]
    collection.updateOne(Guilds::_id eq context.guild.id, Guilds::djRole setTo role.idLong)
    context.channel.sendMessage("\uD83C\uDFA7 – DJ role set to `${role.name}`").queue()
    client.close()
  }
}