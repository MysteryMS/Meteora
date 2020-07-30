package com.mystery.meteora.handler.annotations

@Target(AnnotationTarget.CLASS)
annotation class Module(
    val name: String,
    val category: String
)