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
import org.litote.kmongo.KMongo
import org.litote.kmongo.eq
import org.litote.kmongo.setTo
import org.litote.kmongo.updateOne

@Module("dj", "music")
@Usage("djRole.usage")
@Description("djRole.description")

class DjCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("djrole")
  fun dj() {
    if(!context.member?.hasPermission(Permission.MANAGE_ROLES)!!){
      context.channel.sendMessage("djrole.noPermission".translate(config, context.guild.id)).queue()
      return
    }
    val client = KMongo.createClient(config!!.config?.databaseConfig?.connectionUri!!)
    val database = client.getDatabase("meteora")
    val collection = database.getCollection("guilds")
    if (args.split(' ')[0] == "disabled") {
      collection.updateOne(Guilds::_id eq context.guild.id, Guilds::djRole setTo null)
      client.close()
      context.channel.sendMessage("djRole.off".translate(config, context.guild.id)).queue()
      return
    }
    if (args == "") {
      Helper().explain(context, "djrole", "dj", prefix, config)
      return
    }
    if (context.message.mentionedRoles.isEmpty()) {
      context.channel.sendMessage("djRole.invalidRole").queue()
      return
    }
    val role = context.message.mentionedRoles[0]
    collection.updateOne(Guilds::_id eq context.guild.id, Guilds::djRole setTo role.idLong)
    context.channel.sendMessage("djRole.set".translate(config, context.guild.id, role.name)).queue()
    client.close()
  }
}