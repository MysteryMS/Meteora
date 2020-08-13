package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.model.Guild
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
@Usage("<[role], [disabled>]")

class DjCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("djrole")
  fun dj() {
    val client = KMongo.createClient()
    val database = client.getDatabase("test")
    val collection = database.getCollection("guild")
    if (args.split(' ')[0] == "disabled") {
      collection.updateOne(Guild::_id eq context.guild.id, Guild::djRole setTo null)
      client.close()
      context.channel.sendMessage("\uD83C\uDFA7 – DJ role disabled.").queue()
      return
    }
    if (args == "") {
      Helper().explain(context, "djrole", "dj", prefix)
      return
    }
    val role = context.message.mentionedRoles[0]
    collection.updateOne(Guild::_id eq context.guild.id, Guild::djRole setTo role.idLong)
    context.channel.sendMessage("\uD83C\uDFA7 – DJ role set to `${role.name}`").queue()
    client.close()
  }
}