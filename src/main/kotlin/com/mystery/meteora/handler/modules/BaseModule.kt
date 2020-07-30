package com.mystery.meteora.handler.modules

import net.dv8tion.jda.api.events.message.MessageReceivedEvent

open class BaseModule(
  val context: MessageReceivedEvent,
  val args: String,
  val prefix: String
)