package com.mystery.meteora.apiResponses.geniusApi.searchRes

import com.beust.klaxon.Json

data class Result(
  val title: String,
  @Json("header_image_url")
  val image: String,
  @Json("primary_artist")
  val primaryArtist: PrimaryArtist,
  val url: String,
  val id: Int
)