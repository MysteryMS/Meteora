package com.mystery.meteora.backend.controller

import com.beust.klaxon.Klaxon
import com.beust.klaxon.KlaxonException
import com.mystery.meteora.MeteoraKt
import com.mystery.meteora.backend.controller.models.LocalGuildModel
import com.mystery.meteora.backend.controller.models.OAuthResponse
import com.mystery.meteora.backend.controller.models.deezer.Data
import com.mystery.meteora.backend.controller.models.deezer.TrackObject
import com.mystery.meteora.backend.controller.models.discord.User
import com.mystery.meteora.backend.controller.models.responses.APIResponse
import com.mystery.meteora.backend.controller.models.responses.ErrorResponse
import com.mystery.meteora.backend.controller.models.responses.GuildResponse
import com.mystery.meteora.client.commands.PlayCommand
import com.mystery.meteora.client.lavaPlayer.PlayerController
import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.Request
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpSession

@RestController

class CallbackController<Guild>(private val meteora: MeteoraKt) {
  @CrossOrigin
  @GetMapping("/callback")
  fun login(@RequestParam("code") code: String, session: HttpSession): APIResponse {
    if (code == "") return APIResponse(null, null, null, "Missing callback code")
    val authorizationResponse = Request().setBodies(
      "client_id: 464304679128530954",
      "client_secret: ${Config("./meteora.json").config?.clientConfig?.secret!!}",
      "grant_type: authorization_code",
      "redirect_uri: http://localhost:3000/callback",
      "scope: identify",
      "code: $code"
    ).setHeaders("Content-Type: application/x-www-form-urlencoded")
      .build("POST", "https://discord.com/api/oauth2/token")
    val parsedRes: OAuthResponse?
    try {
      parsedRes = Klaxon().parse<OAuthResponse>(authorizationResponse!!)
      val guildsResponse =
        Request().setHeaders("Authorization: Bearer ${parsedRes?.access_token}")
          .build("GET", "https://discord.com/api/v6/users/@me/guilds")
      val slashMeResponse =
        Request().setHeaders("Authorization: ${parsedRes?.access_token}")
          .build("GET", "https://discord.com/api/v6/users/@me")

      val parsedUser = Klaxon().parse<User>(slashMeResponse!!)
      val guildsObj = Klaxon().parseArray<com.mystery.meteora.backend.controller.models.discord.Guild>(guildsResponse!!)
      val allGuilds: MutableList<LocalGuildModel> = mutableListOf()
      for (item in guildsObj!!) {
        if (item.permissions and 40 != 0) {
          allGuilds.add(
            LocalGuildModel(
              item.id,
              item.name,
              item.iconHash,
              item.permissions,
              meteora.jda.guildCache.getElementById(item.id) != null
            )
          )
        }
      }
      session.setAttribute("user_object", APIResponse(parsedRes?.access_token, parsedUser, allGuilds))
      return APIResponse(parsedRes?.access_token, parsedUser, allGuilds)
    } catch (e: KlaxonException) {
      println(e)
      val err = Klaxon().parse<ErrorResponse>(authorizationResponse!!)
      return APIResponse(null, null, null, err!!.errorDescription)
    }
  }

  @GetMapping("/me")
  fun getUser(session: HttpSession): Any? {
    return session.getAttribute("user_object")
  }

  @GetMapping("/guild")
  fun getUser(@RequestParam("id") guildId: Long): GuildResponse? {
    val response = Request()
      .setHeaders("Authorization: Bot NDY0MzA0Njc5MTI4NTMwOTU0.Wz2vbQ.XWeNf6UsYpUWAu7GJ-MMKFx-nQo")
      .build("GET", "https://discord.com/api/guilds/$guildId")
    return response.let { Klaxon().parse<GuildResponse>(it!!) }
  }

  @GetMapping("/deezer")
  fun deezer(@RequestParam("code") oAuthCode: String, @RequestParam("state") state: String) {
    val accessToken = Request().build(
      "GET",
      "https://connect.deezer.com/oauth/access_token.php?app_id=436102&secret=0566f1f48325db492fcc5a9f793add25&code=$oAuthCode"
    )!!.split("=")[1].split("&")[0]
    val flowList: MutableList<TrackObject> = mutableListOf()
    for (i in 0..5) {
      val flowTracks = Request()
        .build("GET", "https://api.deezer.com/user/me/flow?access_token=$accessToken")
      val parsedFlowTracks = flowTracks?.let { Klaxon().parse<Data>(it) }
      for (item in parsedFlowTracks!!.data) {
        flowList.add(item)
      }
    }
    val context = PlayCommand.map[state]
    if (context!!.guild.memberCache.getElementById(context.member!!.id) == null) {
      context.channel.sendMessage("vc n ta no voice putiane").queue()
      return
    }
    for (item in flowList) {
      PlayerController(context).play("${item.title} - ${item.artist.name}")
    }
    PlayCommand.map.remove(state)
  }
}