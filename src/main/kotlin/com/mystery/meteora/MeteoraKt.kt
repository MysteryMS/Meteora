package com.mystery.meteora

import com.mystery.meteora.client.events.ReactionAddEvent
import com.mystery.meteora.client.events.ReadyEvent
import com.mystery.meteora.client.events.VoiceChannelLeftEvent
import com.mystery.meteora.client.events.VoiceChannelMoveEvent
import com.mystery.meteora.controller.Config
import com.mystery.meteora.handler.Handler
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service

@Component
class MeteoraKt {
  final val jda: JDA

  init {
      val token = Config("./meteora.json")
      jda = JDABuilder.createDefault(token.config?.clientConfig?.token).build()
    }
    @ExperimentalStdlibApi
    @Bean
    fun start() {
      jda.addEventListener(ReadyEvent(), VoiceChannelLeftEvent(), VoiceChannelMoveEvent(), ReactionAddEvent())
      Handler(jda).addModules("com.mystery.meteora")
    }
  }