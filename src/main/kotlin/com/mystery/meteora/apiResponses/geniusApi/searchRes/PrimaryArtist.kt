package com.mystery.meteora.controller.geniusApi.searchRes

import com.beust.klaxon.Json

data class PrimaryArtist(
  @Json("image_url")
  val artistImage: String,
  @Json("is_verified")
  val verified: Boolean,
  val name: String
)