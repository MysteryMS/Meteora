package com.mystery.meteora.backend.controller.models.responses

import com.mystery.meteora.backend.controller.models.Role

data class GuildResponse(
    val id: String,
    val name: String,
    val icon: String?,
    val splash: String?,
    val roles: List<Role>
)