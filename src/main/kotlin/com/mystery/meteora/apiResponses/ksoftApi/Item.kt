package com.mystery.meteora.controller.ksoftApi

import com.beust.klaxon.Json

data class Item(
        val artist: String,
        val album: String,
        val album_year: String,
        @Json("name")
        val trackName: String,
        val lyrics: String,
        val album_art: String,
        val artists: MutableList<Artist> = mutableListOf()
)