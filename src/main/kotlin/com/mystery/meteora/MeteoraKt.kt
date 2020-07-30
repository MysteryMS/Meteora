package com.mystery.meteora

import com.mystery.meteora.client.events.ReadyEvent
import com.mystery.meteora.client.events.VoiceChannelLeftEvent
import com.mystery.meteora.client.events.VoiceChannelMoveEvent
import com.mystery.meteora.controller.Config
import com.mystery.meteora.handler.Handler
import net.dv8tion.jda.api.JDABuilder

class MeteoraKt {
  companion object {
    @ExperimentalStdlibApi
    @JvmStatic
    fun main(args: Array<String>) {
      val jda = JDABuilder.createDefault("NjU2OTUyNzYxMTkxMjM1NTk0.Xxig6Q.IQUild5Vgj1uZWeWtqpDvOeu_Cw").build()
      jda.addEventListener(ReadyEvent(), VoiceChannelLeftEvent(), VoiceChannelMoveEvent())
      Handler(jda).addModules("com.mystery.meteora")
    }
  }
}