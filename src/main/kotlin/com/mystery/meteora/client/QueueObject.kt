package com.mystery.meteora.client

data class QueueObject(
  val messageId: Long,
  val list: List<String>,
  var currentPage: Int
)