package com.mystery.meteora

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class MainKt

@ExperimentalStdlibApi
fun main(args: Array<String>) {
  SpringApplication.run(MainKt::class.java, *args)
}
