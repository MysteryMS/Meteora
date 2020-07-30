package com.mystery.meteora.handler.annotations

@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class Description(
    val description : String
)