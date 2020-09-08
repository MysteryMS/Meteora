package com.mystery.meteora.handler.events

import com.mongodb.client.MongoDatabase
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.model.Guilds
import com.mystery.meteora.handler.Handler
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import org.litote.kmongo.KMongo
import org.litote.kmongo.findOneById
import org.litote.kmongo.getCollection

class MessageEvent : ListenerAdapter() {
  override fun onMessageReceived(event: MessageReceivedEvent) {
    val config = Config("./meteora.json")
    if (!event.channelType.isGuild) return
    val client = KMongo.createClient(config.config?.databaseConfig?.connectionUri!!)
    val database: MongoDatabase = client.getDatabase("meteora")
    val col = database.getCollection<Guilds>()
    var guild = col.findOneById(event.guild.id)
    if (guild == null) {
      col.insertOne(Guilds(event.guild.id, ">", null, "en-US"))
      guild = col.findOneById(event.guild.id)!!
    }
    val p = guild.prefix
    client.close()
    if (event.message.contentRaw == event.jda.selfUser.asMention || event.message.contentRaw == "<@!${event.jda.selfUser.idLong}>") {
      event.channel.sendMessage("Hi there, ${event.author.asMention}. My prefix in this server is `$p`, if you need some help, just use `${p}help`!").queue()
      return
    }
    // val p = "mk."
    Handler.executeCommand(event.message.contentRaw, event, p, config)
  }
}