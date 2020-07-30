package com.mystery.meteora.handler.modules

import kotlin.reflect.KClass

data class Modules(
    val name: String,
    val moduleClass : KClass<*>,
    val category : String,
    val hidden : Boolean,
    val commands : List<Commands>
)