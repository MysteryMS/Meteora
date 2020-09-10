package com.mystery.meteora.client.events

import net.dv8tion.jda.api.events.ReadyEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter

class ReadyEvent : ListenerAdapter(){
  override fun onReady(event: ReadyEvent) {
    println("---------------------------------> Connected to ${event.jda.guilds.size} guilds!")
  }
}