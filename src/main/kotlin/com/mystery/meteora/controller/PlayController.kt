package com.mystery.meteora.controller

import com.mongodb.client.MongoDatabase
import com.mystery.meteora.controller.model.Guild
import org.litote.kmongo.*

class PlayController {
  fun hasDjRole(guildId: Long): Boolean {
    val client = KMongo.createClient()
    val database: MongoDatabase = client.getDatabase("test")
    val col = database.getCollection<Guild>()
    val guild = col.findOneById(guildId)
    client.close()
    return guild!!.djRole != 0L
  }
}