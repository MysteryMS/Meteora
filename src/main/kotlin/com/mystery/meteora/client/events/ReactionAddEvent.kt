package com.mystery.meteora.client.events

import com.mystery.meteora.client.commands.LanguageCommand
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.LocaleController
import com.mystery.meteora.controller.model.Guilds
import net.dv8tion.jda.api.entities.MessageReaction
import net.dv8tion.jda.api.events.message.react.MessageReactionAddEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import org.litote.kmongo.KMongo
import org.litote.kmongo.eq
import org.litote.kmongo.setTo
import org.litote.kmongo.updateOne

class ReactionAddEvent : ListenerAdapter() {
    override fun onMessageReactionAdd(event: MessageReactionAddEvent) {
        val list = LanguageCommand.messages
        if (event.user == event.jda.selfUser) return
        if (list.contains(event.messageIdLong)) {
            when (event.reactionEmote) {
                MessageReaction.ReactionEmote.fromUnicode("\uD83C\uDDE7\uD83C\uDDF7", event.jda) -> {
                    event.retrieveMessage().queue { message -> message.delete().queue() }
                    event.channel.sendMessage("É isso aí! E o time brasileiro vence novamente! \uD83C\uDDE7\uD83C\uDDF7").queue()
                    list.remove(event.messageIdLong)
                    LocaleController().changeLanguage("pt-BR", Config("./meteora.json"), event.guild.id)
                }
                MessageReaction.ReactionEmote.fromUnicode("\uD83C\uDDFA\uD83C\uDDF8", event.jda) -> {
                    event.retrieveMessage().queue { message -> message.delete().queue() }
                    event.channel.sendMessage("Oh! English? I really appreciate this language. \uD83C\uDDFA\uD83C\uDDF8").queue()
                    list.remove(event.messageIdLong)
                    LocaleController().changeLanguage("en-US", Config("./meteora.json"), event.guild.id)
                }
            }
        }
    }
}