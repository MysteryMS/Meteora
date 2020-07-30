package com.mystery.meteora.handler.modules

import kotlin.reflect.KFunction

data class Commands(
  val names: Array<String>,
  val hidden: Boolean,
  val commandFunction: KFunction<*>
) {

  override fun equals(other: Any?): Boolean {
    if (this === other) return true
    if (javaClass != other?.javaClass) return false

    other as Commands

    if (!names.contentEquals(other.names)) return false
    if (hidden != other.hidden) return false
    if (commandFunction != other.commandFunction) return false

    return true
  }

  override fun hashCode(): Int {
    var result = names.contentHashCode()
    result = 31 * result + hidden.hashCode()
    result = 31 * result + commandFunction.hashCode()
    return result
  }
}