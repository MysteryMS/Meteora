package com.mystery.meteora.client.commands

import com.beust.klaxon.Klaxon
import com.mystery.meteora.apiResponses.deezerApi.Data
import com.mystery.meteora.controller.Config
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import com.mystery.meteora.handler.modules.GraphicUtils
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import okhttp3.OkHttpClient
import okhttp3.Request
import java.awt.Font
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.net.URI
import java.net.URL
import javax.imageio.ImageIO


@Module("charts", "music")

class ChartsCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  private val buffer = BufferedImage(600, 500, BufferedImage.TYPE_INT_RGB)
  private val graphics = buffer.createGraphics()
  val client = OkHttpClient().newBuilder().build()
  val request = Request.Builder()
    .url("https://api.deezer.com/chart/0/tracks")
    .get()
    .build()
  private val response = client.newCall(request).execute().body()!!.string()
  private val parsedResponse = Klaxon().parse<Data>(response)

  @Command("charts")
  fun charts() {
    GraphicUtils.setQuality(graphics)
    val boldFont = Font("Poppins", Font.BOLD, 50)
    val extraLightFont = Font("Poppins ExtraLight", Font.PLAIN, 34)
    val uri = URL(parsedResponse!!.data[0].album.cover_big)
    val image = ImageIO.read(uri)
    graphics.drawImage(image,0, 0, 600, 500, null)
    graphics.font = Font("Poppins", Font.BOLD, 50)
    var center = getCenter(boldFont, "Deezer Charts")
    graphics.drawString("Deezer Charts", 300 - center, 50)
    graphics.font = extraLightFont
    center = getCenter(extraLightFont, "Top Tracks")
    graphics.drawString("Top Tracks", 300 - center, 115)


    val baos = ByteArrayOutputStream()
    ImageIO.write(buffer, "png", baos)
    context.channel.sendFile(baos.toByteArray(), "buseta.png").queue()
  }

  private fun getCenter(font: Font, stringName: String): Int {
    val metrics = graphics.getFontMetrics(font)
    return metrics.stringWidth(stringName) / 2
  }
}