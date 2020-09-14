package com.mystery.meteora.client.events

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.model.Guilds
import net.dv8tion.jda.api.Region
import net.dv8tion.jda.api.events.guild.GuildJoinEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import org.litote.kmongo.KMongo
import org.litote.kmongo.getCollection

class GuildCreateEvent : ListenerAdapter() {
    override fun onGuildJoin(event: GuildJoinEvent) {
        val client = KMongo.createClient(Config("./meteora.json").config?.databaseConfig?.connectionUri!!)
        val database = client.getDatabase("meteora").getCollection<Guilds>()
        if (event.guild.region == Region.BRAZIL) {
            database.insertOne(Guilds(event.guild.id, ">", null, "pt-BR"))
            client.close()
        } else {
            database.insertOne(Guilds(event.guild.id, ">", null, "en-US"))
            client.close()
        }
    }
}