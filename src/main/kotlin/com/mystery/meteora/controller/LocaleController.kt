package com.mystery.meteora.controller

import com.mystery.meteora.controller.model.Guilds
import org.litote.kmongo.*
import java.util.*

  fun String.translate(config: Config?, guildId: String, vararg params: Any): String {
    val client = KMongo.createClient(config?.config?.databaseConfig?.connectionUri!!)
    val guild = client.getDatabase("meteora").getCollection<Guilds>().findOneById(guildId)
    val locale = guild?.language?.split( '-')!!
    val bundle = ResourceBundle.getBundle("commands", Locale(locale[0], locale[1]))
    val string = bundle.getString(this)
    client.close()
    return string.format(*params)
  }
class LocaleController {
  fun changeLanguage(lang: String, config: Config, guildId: String) {
    val client = KMongo.createClient(config.config?.databaseConfig?.connectionUri!!)
    val guild = client.getDatabase("meteora").getCollection("guilds")
    guild.updateOne(Guilds::_id eq guildId, Guilds::language setTo lang)
    client.close()
  }
}