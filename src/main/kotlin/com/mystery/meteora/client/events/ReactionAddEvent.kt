package com.mystery.meteora.client.events

import com.mystery.meteora.client.commands.LanguageCommand
import com.mystery.meteora.client.commands.QueueCommand
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.LocaleController
import kotlinx.coroutines.*
import net.dv8tion.jda.api.entities.MessageReaction
import net.dv8tion.jda.api.events.message.react.MessageReactionAddEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter

class ReactionAddEvent : ListenerAdapter() {
  override fun onMessageReactionAdd(event: MessageReactionAddEvent) {
    val list = LanguageCommand.messages
    if (event.user == event.jda.selfUser) return
    if (list.contains(event.messageIdLong)) {
      if (event.reactionEmote == MessageReaction.ReactionEmote.fromUnicode("\uD83C\uDDE7\uD83C\uDDF7", event.jda)) {
        event.retrieveMessage().queue { message -> message.delete().queue() }
        LanguageCommand.shouldDie = false
        event.channel.sendMessage("É isso aí! E o time brasileiro vence novamente! \uD83C\uDDE7\uD83C\uDDF7")
          .queue()
        list.remove(event.messageIdLong)
        LocaleController().changeLanguage("pt-BR", Config("./meteora.json"), event.guild.id)
      } else if (event.reactionEmote == MessageReaction.ReactionEmote.fromUnicode(
          "\uD83C\uDDFA\uD83C\uDDF8",
          event.jda
        )
      ) {
        event.retrieveMessage().queue { message -> message.delete().queue() }
        event.channel.sendMessage("Oh! English? I really appreciate this language. \uD83C\uDDFA\uD83C\uDDF8")
          .queue()
        LanguageCommand.shouldDie = false
        list.remove(event.messageIdLong)
        LocaleController().changeLanguage("en-US", Config("./meteora.json"), event.guild.id)
      }
    }

    val queueList = QueueCommand.pages
    if (queueList.containsKey(event.guild.idLong)) {
      var currentPage = queueList[event.guild.idLong]!!.currentPage
      val message = event.retrieveMessage()
      if (event.reactionEmote == MessageReaction.ReactionEmote.fromUnicode("\u2B05", event.jda)) {
        message.queue { m ->
          if (currentPage == 0) {
            m.reactions.remove(event.reaction)
            return@queue
          }
          currentPage--
          m.editMessage(queueList[m.guild.idLong]!!.list[currentPage - 1])
          m.reactions.remove(event.reaction)
        }
      } else if (event.reactionEmote == MessageReaction.ReactionEmote.fromUnicode("\u27A1\ufe0f", event.jda)) {
        message.queue { m ->
          if (currentPage == queueList[event.guild.idLong]!!.list.size) {
            m.reactions.remove(event.reaction)
            return@queue
          }
          currentPage++
          m.editMessage(queueList[m.guild.idLong]!!.list[currentPage]).queue()
        }
      }
    }
  }
}