package com.mystery.meteora.backend.controller.models.responses

import com.beust.klaxon.Json

data class ErrorResponse(
        val error: String,
        @Json("error_description")
        val errorDescription: String
)