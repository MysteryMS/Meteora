package com.mystery.meteora.controller

import com.mystery.meteora.client.QueueObject
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.events.message.react.MessageReactionAddEvent
import net.dv8tion.jda.api.requests.RestAction

class PaginatorController(
    private val map: MutableMap<Long, QueueObject>,
    val message: RestAction<Message>
) {
    fun increase() {
        message.queue { msg ->
            if (guilds[msg.guild.idLong] == null) {
                guilds[msg.guild.idLong] = 0
            }
            var currentPage = guilds[msg.guild.idLong]!!
            if (currentPage + 1 == map[msg.guild.idLong]!!.list.size) return@queue
            guilds[msg.guild.idLong] = ++currentPage
            val newMessage = map[msg.guild.idLong]!!.list[currentPage]
            msg.editMessage(newMessage).queue()
        }
    }

    fun decrease() {
        message.queue { msg ->
            if (guilds[msg.guild.idLong] == null) {
                guilds[msg.guild.idLong] = 0
            }
            var currentPage = guilds[msg.guild.idLong]!!
            if (currentPage - 1 < 0) return@queue
            guilds[msg.guild.idLong] = --currentPage
            val newMessage = map[msg.guild.idLong]!!.list[currentPage]
            msg.editMessage(newMessage).queue()
        }
    }

    companion object {
        val guilds: MutableMap<Long, Int> = mutableMapOf()
    }
}

