package com.mystery.meteora.backend.controller.models.responses

import com.mystery.meteora.backend.controller.models.LocalGuildModel
import com.mystery.meteora.backend.controller.models.User

data class APIResponse(
  val access_token: String?,
  val user: User?,
  val guilds: MutableList<LocalGuildModel>?,
  val error: String? = null
)