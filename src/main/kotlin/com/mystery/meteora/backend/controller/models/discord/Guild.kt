package com.mystery.meteora.backend.controller.models.discord

import com.beust.klaxon.Json

data class Guild(
        val id: String,
        val name: String,
        @Json("icon")
        val iconHash: String?,
        val permissions: Int

)