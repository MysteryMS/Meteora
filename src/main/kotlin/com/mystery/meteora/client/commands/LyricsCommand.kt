package com.mystery.meteora.client.commands

import com.beust.klaxon.Klaxon
import com.mystery.meteora.controller.Helper
import com.mystery.meteora.controller.geniusApi.searchRes.Tuso
import com.mystery.meteora.controller.geniusApi.songMetadata.Tudo
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.annotations.Usage
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.safety.Whitelist
import org.litote.kmongo.json
import java.awt.Color
import java.net.URL

@Module("Lyrics", "music")
@Usage("<track-name>")

class LyricsCommand(ctx: MessageReceivedEvent, args: String, prefix: String) : BaseModule(ctx, args, prefix) {
  @Command("lyrics", "Letra")
  fun lyrics() {
    if (args == "") {
      Helper().explain(context, "lyrics", "Lyrics", prefix)
      return
    }
    val request = URL("https://genius.com/api/search/?q=${args.replace(' ', '+')}").readText()
    val response = Klaxon().parse<Tuso>(request)
    if (response?.response?.hits?.isEmpty()!!) {
      context.channel.sendMessage("Sorry, no matches found \uD83D\uDC81\u200D♀️").queue()
      return
    }
    if (response.response.hits[0].type != "song") {
      context.channel.sendMessage("Sorry, no matches found \uD83D\uDC81\u200D♀️").queue()
      return
    }
    val url = response.response.hits[0].result.url
    val document = Jsoup.connect(url).get()
    var abc = document.body().getElementsByClass("Lyrics__Container-sc-1ynbvzw-2")
    if (abc.size == 0) abc = document.body().getElementsByClass("lyrics")
    var minhaString = ""
    abc.forEach { element -> minhaString += element.html()}
    minhaString = Jsoup.clean(minhaString, "", Whitelist.simpleText().addTags("br"), Document.OutputSettings().prettyPrint(true))
    val splitted = minhaString.replace("<b>", "**").replace("<i>", "_").replace("</b>", "**").replace("</i>", "_").split("<br>")
    val array: MutableList<String> = mutableListOf()
    var d = ""
    for (item in splitted) {
      if (d.length + item.length > 2001) {
        array.add(d)
        d = ""
      } else {
         d += item.trimStart(' ')
      }
    }
    array.add(d)
    array.forEach {element ->
      if (element.isEmpty()) return
      context.channel.sendMessage(element).queue()}
    val obj = response.response.hits[0].result
    val songRequest = URL("https://genius.com/api/songs/${obj.id}").readText()
    val songObject = Klaxon().parse<Tudo>(songRequest)
    val tudo = songObject?.response?.song
    val album = tudo?.album?.name ?: "\uD83E\uDD37\u200D♀️"
    val releaseDate = tudo?.releasedAt ?: "\uD83E\uDD37\u200D♀️"
    val writers = if (tudo?.writers?.get(0)?.name == null) "\uD83E\uDD37\u200D♀️" else tudo.writers.joinToString(", ") { element -> element.name }
    val producers = if (tudo?.producers?.get(0)?.name == null) "\uD83E\uDD37\u200D♀️" else tudo.producers.joinToString(", ") { element -> element.name }
    val embed = EmbedBuilder()
      .setTitle(obj.title, obj.url)
      .setDescription("Performed by `${obj.primaryArtist.name}`\nWritten by: $writers\nProduced by: $producers\nReleased at $releaseDate\nFrom the album `$album`")
      .setColor(Color(253, 250, 62))
      .setImage(obj.image)
      .setFooter(obj.primaryArtist.name, obj.primaryArtist.artistImage)
    context.channel.sendMessage(embed.build()).queue()
  }
}