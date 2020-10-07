package com.mystery.meteora.controller

import kotlin.random.Random

class StateController {
    companion object {
        fun getState(): String {
            val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')
            return (1..35)
                .map { Random.nextInt(0, charPool.size) }
                .map(charPool::get)
                .joinToString("")
        }
    }
}