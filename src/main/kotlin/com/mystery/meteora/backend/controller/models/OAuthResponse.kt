package com.mystery.meteora.backend.controller.models

data class OAuthResponse(
        val access_token: String?,
        val refresh_token: String?,
        val scope: String?
)