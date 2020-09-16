package com.mystery.meteora.backend.controller.models

data class LocalGuildModel(
    val id: String,
    val name: String,
    val iconHash: String?,
    val permissions: Int,
    val available: Boolean
)