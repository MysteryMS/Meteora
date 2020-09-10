package com.mystery.meteora.controller

import com.beust.klaxon.Klaxon
import com.mystery.meteora.controller.model.Client
import com.mystery.meteora.controller.model.ConfigModel
import com.mystery.meteora.controller.model.Database
import java.io.File

class Config(path: String) {
    companion object {
        val config = Config("./meteora.json")
    }
    var config: ConfigModel? = null
        private set

    init {
        val file = File(path)
        if (file.exists()) {
            val json = file.readText()
            config = Klaxon().parse<ConfigModel>(json)
        } else {
            file.createNewFile()
            file.writeText(Klaxon().toJsonString(ConfigModel(Client("Your bot token goes here!", "Secret goes here, used for backend things."), Database("Database URI in mongodb:// format."))))
        }
    }
}