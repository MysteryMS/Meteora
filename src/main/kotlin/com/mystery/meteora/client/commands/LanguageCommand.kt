package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.LocaleController
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

@Module("Language", "management")
class LanguageCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  companion object {
    val messages = mutableListOf<Long>()
    var shouldDie = false
  }

  @Command("language", "lang", "idioma")
  fun prefix() {
    if (!context.member?.hasPermission(Permission.MESSAGE_MANAGE)!!) {
      context.channel.sendMessage("language.noPerms".translate(config, context.guild.id)).queue()
      return
    }
    val portugueseAliases = mutableListOf("ptbr", "pt-br", "pt_br", "portuguese", "brazilian", "brazil")
    val englishAliases = mutableListOf("enus", "en-us", "en_us", "english", "american")
    if (portugueseAliases.contains(args.split(" ")[0].toLowerCase())) {
      context.channel.sendMessage("É isso aí! E o time brasileiro vence novamente! \uD83C\uDDE7\uD83C\uDDF7").queue()
      return LocaleController().changeLanguage("pt-BR", config!!, context.guild.id)
    } else if (englishAliases.contains(args.split(" ")[0].toLowerCase())) {
      context.channel.sendMessage("Oh! English? I really appreciate this language. \uD83C\uDDFA\uD83C\uDDF8").queue()
      return LocaleController().changeLanguage("en-US", config!!, context.guild.id)
    }
    val embed = EmbedBuilder()
      .setTitle("language.title".translate(config, context.guild.id))
      .setDescription("language.description".translate(config, context.guild.id))
      .setFooter("language.tip".translate(config, context.guild.id))
    context.channel.sendMessage(embed.build()).queue { message ->
      message.addReaction("\uD83C\uDDE7\uD83C\uDDF7").queue(); message.addReaction("\uD83C\uDDFA\uD83C\uDDF8")
      .queue(); messages.add(message.idLong)
      GlobalScope.launch {
        delay(10000)
        if (shouldDie) this.cancel()
        println("oi perereca")
        messages.remove(context.messageIdLong)
        message.clearReactions().queue()
      }
    }
  }
}