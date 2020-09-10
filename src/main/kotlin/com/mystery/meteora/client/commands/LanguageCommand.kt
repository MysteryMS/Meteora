package com.mystery.meteora.client.commands

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.LocaleController
import com.mystery.meteora.controller.model.Guilds
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.litote.kmongo.KMongo
import org.litote.kmongo.eq
import org.litote.kmongo.setTo
import org.litote.kmongo.updateOne

@Module("Language", "management")
class LanguageCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) : BaseModule(ctx, args, prefix, config) {
    companion object {
        val messages = mutableListOf<Long>()
    }
    @Command("language", "lang", "idioma")
    fun prefix() {
        val portugueseAliases = mutableListOf("ptbr", "pt-br", "pt_br", "portuguese", "brazilian", "brazil")
        val englishAliases = mutableListOf("enus", "en-us", "en_us", "english", "american")
        if (portugueseAliases.contains(args.split(" ")[0].toLowerCase())) {
            return LocaleController().changeLanguage("pt-BR", config!!, context.guild.id)
        } else if (englishAliases.contains(args.split(" ")[0].toLowerCase())) {
            return LocaleController().changeLanguage("en-US", config!!, context.guild.id)
                }
        val embed = EmbedBuilder()
                .setTitle("language.title")
                .setDescription("language.description")
                .setFooter("language.tip")
        context.channel.sendMessage(embed.build()).queue { message -> message.addReaction("\uD83C\uDDE7\uD83C\uDDF7").queue(); message.addReaction("\uD83C\uDDFA\uD83C\uDDF8").queue(); messages.add(message.idLong) }
    }
}