package com.mystery.meteora.handler.events

import com.mongodb.client.MongoDatabase
import com.mystery.meteora.controller.model.Guild
import com.mystery.meteora.handler.Handler
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import org.litote.kmongo.KMongo
import org.litote.kmongo.findOneById
import org.litote.kmongo.getCollection

class MessageEvent : ListenerAdapter() {
  override fun onMessageReceived(event: MessageReceivedEvent) {
    if (!event.channelType.isGuild) return
    val client = KMongo.createClient()
    val database: MongoDatabase = client.getDatabase("test")
    val col = database.getCollection<Guild>()
    var guild = col.findOneById(event.guild.id)
    if (guild == null) {
      col.insertOne(Guild(event.guild.id, ">"))
      guild = col.findOneById(event.guild.id)
    }
    val p = guild?.prefix
    client.close()
    // val p = "mk."
    Handler.executeCommand(event.message.contentRaw, event, p!!)
  }
}