package com.mystery.meteora.backend.controller.models.discord

import com.beust.klaxon.Json

data class User(
        val id: String,
        val username: String,
        val discriminator: String,
        @Json("avatar")
        val avatarHash: String?
)