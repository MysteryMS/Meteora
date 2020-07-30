package com.mystery.meteora.controller.geniusApi.songMetadata

import com.beust.klaxon.Json

data class Song(
  @Json("release_date_for_display")
  val releasedAt: String?,
  val album: Album?,
  @Json("producer_artists")
  val producers: List<Artist>? = arrayListOf(),
  @Json("writer_artists")
  val writers: List<Artist>? = arrayListOf()
)