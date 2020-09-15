package com.mystery.meteora.backend.controller

import com.beust.klaxon.Klaxon
import com.beust.klaxon.KlaxonException
import com.mystery.meteora.MeteoraKt
import com.mystery.meteora.backend.controller.models.Guild
import com.mystery.meteora.backend.controller.models.OAuthResponse
import com.mystery.meteora.backend.controller.models.User
import com.mystery.meteora.backend.controller.models.responses.APIResponse
import com.mystery.meteora.backend.controller.models.responses.ErrorResponse
import com.mystery.meteora.controller.Config
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import org.springframework.boot.web.servlet.server.Session
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpSession

@RestController

class CallbackController(private val meteora: MeteoraKt) {
  @CrossOrigin
  @GetMapping("/callback")
  fun login(@RequestParam("code") code: String, session: HttpSession): APIResponse {
    if (code == "") return APIResponse(null, null, null, null, "Missing callback code")
    val client = OkHttpClient().newBuilder().build()
    val formBody = FormBody.Builder()
      .add("client_id", "464304679128530954")
      .add("client_secret", Config("./meteora.json").config?.clientConfig?.secret!!)
      .add("grant_type", "authorization_code")
      .add("redirect_uri", "http://localhost:3000/user")
      .add("scope", "identify")
      .add("code", code)
      .build()
    val authorization = Request.Builder()
      .url("https://discord.com/api/v6/oauth2/token")
      .addHeader("Content-Type", "application/x-www-form-urlencoded")
      .post(formBody)
      .build()
    val authorizationCall = client.newCall(authorization)
    val authorizationResponse = authorizationCall.execute().body()!!.string()
    val parsedRes: OAuthResponse?
    try {
      parsedRes = Klaxon().parse<OAuthResponse>(authorizationResponse)
      val guilds = Request.Builder()
        .url("https://discord.com/api/v6/users/@me/guilds")
        .addHeader("Authorization", "Bearer ${parsedRes?.access_token}")
        .get()
        .build()
      val slashMe = Request.Builder()
        .url("https://discord.com/api/v6/users/@me")
        .addHeader("Authorization", "Bearer ${parsedRes?.access_token}")
        .get()
        .build()

      val slashMeCall = client.newCall(slashMe)
      val slashMeResponse = slashMeCall.execute().body()!!.string()
      val parsedUser = Klaxon().parse<User>(slashMeResponse)
      val guildsRes = client.newCall(guilds).execute().body()!!.string()
      val guildsObj = Klaxon().parseArray<Guild>(guildsRes)
      val availableGuilds = guildsObj?.filter { guild -> guild.permissions and 40 != 0 && meteora.jda.guildCache.getElementById(guild.id) != null}
      val unavailableGuilds = guildsObj?.filter { guild -> guild.permissions and 40 != 0 && meteora.jda.guildCache.getElementById(guild.id) == null }
      session.setAttribute("user_object", APIResponse(parsedRes?.access_token, parsedUser, availableGuilds, unavailableGuilds))
      return APIResponse(parsedRes?.access_token, parsedUser, availableGuilds, unavailableGuilds)
    } catch (e: KlaxonException) {
      println(e)
      val err = Klaxon().parse<ErrorResponse>(authorizationResponse)
      return APIResponse(null, null, null, null, err!!.errorDescription)
    }
  }

  @GetMapping("getUser")
  fun getUser(@RequestParam("token") jwt: String) {
  }
}