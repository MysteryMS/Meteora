package com.mystery.meteora

import com.mystery.meteora.client.events.*
import com.mystery.meteora.controller.Config
import com.mystery.meteora.handler.Handler
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import net.dv8tion.jda.api.entities.MessageChannel
import net.dv8tion.jda.api.entities.TextChannel
import net.dv8tion.jda.api.entities.VoiceChannel
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component

@Component
class MeteoraKt {
  final val jda: JDA
  final lateinit var context: MessageReceivedEvent

  init {
      val token = Config("./meteora.json")
      jda = JDABuilder.createDefault(token.config?.clientConfig?.token).build()
    }
    @ExperimentalStdlibApi
    @Bean
    fun start() {
      jda.addEventListener(ReadyEvent(), VoiceChannelLeftEvent(), VoiceChannelMoveEvent(), ReactionAddEvent(), GuildCreateEvent())
      Handler(jda).addModules("com.mystery.meteora")
    }
  }