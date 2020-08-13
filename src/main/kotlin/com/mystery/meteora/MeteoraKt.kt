package com.mystery.meteora

import com.mystery.meteora.client.events.ReadyEvent
import com.mystery.meteora.client.events.VoiceChannelLeftEvent
import com.mystery.meteora.client.events.VoiceChannelMoveEvent
import com.mystery.meteora.controller.Config
import com.mystery.meteora.handler.Handler
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Service

@Service
class MeteoraKt {
  lateinit var jda: JDA
    @ExperimentalStdlibApi
    @Bean
    fun start() {
      val token = Config("./meteora.json")
      val jda = JDABuilder.createDefault(token.config?.clientConfig?.token).build()
      jda.addEventListener(ReadyEvent(), VoiceChannelLeftEvent(), VoiceChannelMoveEvent())
      Handler(jda).addModules("com.mystery.meteora")
    }
  }