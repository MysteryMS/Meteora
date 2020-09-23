package com.mystery.meteora.client.commands

import com.beust.klaxon.Klaxon
import com.mystery.meteora.apiResponses.deezerApi.Data
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.GraphicUtils
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Module
import com.mystery.meteora.handler.modules.BaseModule
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Font
import java.awt.image.BufferedImage
import java.awt.image.BufferedImageOp
import java.awt.image.ConvolveOp
import java.awt.image.Kernel
import java.io.ByteArrayOutputStream
import java.net.URL
import javax.imageio.ImageIO


@Module("charts", "music")

class ChartsCommand(ctx: MessageReceivedEvent, args: String, prefix: String, config: Config) :
  BaseModule(ctx, args, prefix, config) {
  private var bufferedImage = BufferedImage(600, 500, BufferedImage.TYPE_INT_RGB)
  private val graphics = bufferedImage.createGraphics()
  private val response = com.mystery.meteora.controller.Request().build("GET", "https://api.deezer.com/chart/0/tracks")
  private val parsedResponse = Klaxon().parse<Data>(response!!)

  @Command("charts")
  fun charts() {
    GraphicUtils.setQuality(graphics)
    val boldFont = Font("Poppins", Font.BOLD, 50)
    val extraLightFont = Font("Poppins ExtraLight", Font.PLAIN, 34)
    val uri = URL(parsedResponse!!.data[0].album.cover_big)
    val image = ImageIO.read(uri)
    graphics.drawImage(image, 0, 0, 600, 500, null)
    val radius = 11
    val size = radius * 2 + 1
    val weight = 1.0f / (size * size)
    val data = FloatArray(300000)
    for (i in data.indices) {
      data[i] = weight
    }
    val kernel = Kernel(13, 13, null)
    val op = ConvolveOp(kernel, 0, null)
    bufferedImage = op.filter(bufferedImage, null)
    val graphics2 = bufferedImage.createGraphics()
    GraphicUtils.setQuality(graphics2)
    graphics2.font = Font("Poppins", Font.BOLD, 50)
    var center = getCenter(boldFont, "Deezer Charts")
    graphics2.drawString("Deezer Charts", 300 - center, 50)
    graphics2.font = extraLightFont
    center = getCenter(extraLightFont, "Top Tracks")
    graphics2.drawString("Top Tracks", 300 - center, 115)


    val baos = ByteArrayOutputStream()
    ImageIO.write(bufferedImage, "png", baos)
    context.channel.sendFile(baos.toByteArray(), "buseta.png").queue()
  }

  private fun getCenter(font: Font, stringName: String): Int {
    val metrics = graphics.getFontMetrics(font)
    return metrics.stringWidth(stringName) / 2
  }
}