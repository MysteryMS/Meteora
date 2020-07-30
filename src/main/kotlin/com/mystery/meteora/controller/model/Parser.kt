package com.mystery.meteora.controller.model

class Parser() {
  fun parse(time: Long?): String {
    val minutes = time?.div(1000)?.div(60)
    val seconds = time?.div(1000)?.rem(60)
    return "${minutes}min ${seconds}s"
  }
}