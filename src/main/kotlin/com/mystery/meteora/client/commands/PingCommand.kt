package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Config
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("PingCommand", "util")

class PingCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
  @Command("ping")
  fun ping() {
    val gatewayPing = context.jda.gatewayPing.toString()
    // val restPing = context.jda.restPing.toString()
    context.channel.sendMessage("Gateway Ping: ${gatewayPing}ms").queue()
  }
}