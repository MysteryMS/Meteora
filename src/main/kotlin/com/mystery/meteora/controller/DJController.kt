package com.mystery.meteora.controller

import com.mongodb.client.MongoDatabase
import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.model.Guilds
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.litote.kmongo.KMongo
import org.litote.kmongo.findOneById
import org.litote.kmongo.getCollection

class DJController {
  fun hasDjRole(context: MessageReceivedEvent, authorAllowed: Boolean): Boolean? {
    val client = KMongo.createClient(Config("./meteora.json").config?.databaseConfig?.connectionUri!!)
    val database: MongoDatabase = client.getDatabase("meteora")
    val col = database.getCollection<Guilds>()
    val guild = col.findOneById(context.guild.id)
    val roleId = guild?.djRole
    val role = context.guild.roles.find { role -> role.idLong == roleId } ?: return null
    client.close()
    return if (authorAllowed) {
      context.member?.roles?.contains(role)!! || context.member!!.user.idLong == PlayerController(context).manager.trackScheduler.requestedByAuthorId || context.member!!.hasPermission(Permission.ADMINISTRATOR)
    } else {
      context.member?.roles?.contains(role)!! || context.member!!.hasPermission(Permission.ADMINISTRATOR)
    }
  }
}