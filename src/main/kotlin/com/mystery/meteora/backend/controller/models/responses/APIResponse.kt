package com.mystery.meteora.backend.controller.models.responses

import com.mystery.meteora.backend.controller.models.User

data class APIResponse(
  val access_token: String?,
  val user: User?,
  val availableGuilds: List<com.mystery.meteora.backend.controller.models.Guild>?,
  val unavailableGuilds: List<com.mystery.meteora.backend.controller.models.Guild>?,
  val error: String? = null
)