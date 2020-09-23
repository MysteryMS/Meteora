package com.mystery.meteora

import com.mystery.meteora.client.events.*
import com.mystery.meteora.controller.Config
import com.mystery.meteora.handler.Handler
import io.sentry.Sentry
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component

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
      jda.addEventListener(ReadyEvent(), VoiceChannelLeftEvent(), VoiceChannelMoveEvent(), ReactionAddEvent(), GuildCreateEvent())
      Handler(jda).addModules("com.mystery.meteora")
      Sentry.init("https://c401e32e9570400b99081acfcdd2f29b@o388147.ingest.sentry.io/5438815")
    }
  }