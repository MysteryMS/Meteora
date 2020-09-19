package com.mystery.meteora.client.commands

import com.beust.klaxon.Klaxon
import com.beust.klaxon.KlaxonException
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.lastFmApi.Response
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Description
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import java.awt.Color
import java.util.*

@Module("lastfm", "music")
@Usage("lastfm.usage")
@Description("lastfm.description")

class LastFMCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  @Command("lastfm", "lfm")
  fun lastfm() {
    if (args == "") {
      Helper().explain(context, "lastfm", "lastfm", prefix, config!!)
      return
    }
    val client = OkHttpClient().newBuilder().build()
    val mediaType = MediaType.parse("application/json")
    val body = RequestBody.create(
      mediaType,
      "{\n\"theme\": \"duotone\",\n\"options\": " +
          "{\n\"user\": \"$args\",\n\"period\": \"7day\",\n\"top\": \"tracks\"," +
          "\n\"pallete\": \"sea\",\n\"story\": false,\n\"messages\": {\n\"scrobbles\": " +
          "[\n\"scrobbles\",\n\"last 7 days\"\n],\n\"subtitle\": \"last 7 days\"," +
          "\n\"title\": \"MOST LISTENED TRACKS\"\n}\n}\n}"
    )
    val request = Request.Builder()
      .url("https://generator.musicorumapp.com/generate")
      .method("POST", body)
      .addHeader("Content-Type", "application/json")
      .addHeader("X-Source", "meteora caralho")
      .build()
    val response = client.newCall(request).execute()
    val base64 = response.body()!!.string().replace("data:image/jpeg;base64,", "")
    try {
      val parsedResponse = Klaxon().parse<Response>(base64)!!
      val byteImage = Base64.getDecoder().decode(parsedResponse.base64)
      val embed = EmbedBuilder()
        .setImage("attachment://${context.author.id}.png")
        .setColor(Color(104, 235, 193))
      context.channel.sendFile(byteImage, "${context.author.id}.png").embed(embed.build()).queue()
    } catch (e: KlaxonException) {
      context.channel.sendMessage("lastfm.noUser".translate(config!!, context.guild.id, args)).queue()
    }
  }
}