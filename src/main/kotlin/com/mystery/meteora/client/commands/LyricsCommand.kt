package com.mystery.meteora.client.commands

import com.beust.klaxon.Klaxon
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.apiResponses.ksoftApi.Data
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import okhttp3.OkHttpClient
import okhttp3.Request
import java.awt.Color

@Module("Lyrics", "music")
@Usage("lyrics.usage")
@Description("lyrics.description")

class LyricsCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  @Command("lyrics", "letra", "ly")
  fun lyrics() {
    if (args == "") {
      Helper().explain(context, "lyrics", "Lyrics", prefix, config!!)
      return
    }
    val client = OkHttpClient().newBuilder().build()
    val request = Request.Builder()
      .url("https://api.ksoft.si/lyrics/search?q=$args")
      .addHeader("Authorization", "Bearer ${config?.config?.apiTokens?.ksoft!!}")
      .get()
      .build()
    val call = client.newCall(request)
    val callResponse = call.execute().body()?.string()
    val response = Klaxon().parse<Data>(callResponse!!)
    if (response!!.data.isEmpty()) {
      context.channel.sendMessage("lyrics.noMatches".translate(config, context.guild.id)).queue()
      return
    }
    val lyricsList: MutableList<String> = mutableListOf()
    val track = response.data[0]
    val embed1 = EmbedBuilder()
      .setTitle("\"${track.trackName}\" lyrics")
      .setColor(Color(253, 250, 62))
      .setAuthor("${track.artist} on ${track.album} (${track.album_year})")
      .setThumbnail(track.album_art)
    val embed2 = EmbedBuilder()
      .setColor(Color(253, 250, 62))
    if (track.lyrics.length > 2048) {
      lyricsList.add(track.lyrics.slice(0..2040))
      lyricsList.add(track.lyrics.slice(2041 until track.lyrics.length))
    } else {
      lyricsList.add(track.lyrics)
    }
    if (lyricsList.size > 1) {
      context.channel.sendMessage(embed1.setDescription(lyricsList[0]).build()).queue()
      context.channel.sendMessage(embed2.setDescription(lyricsList[1]).setFooter("Powered by KSoft.Si").build()).queue()
    } else {
      context.channel.sendMessage(embed1.setDescription(lyricsList[0]).setFooter("Powered by KSoft.Si").build()).queue()
    }
  }
}