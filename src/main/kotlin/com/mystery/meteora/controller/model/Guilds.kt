package com.mystery.meteora.controller.model

import net.dv8tion.jda.api.entities.Role

class Guilds(
  val _id: String,
  val prefix: String,
  val djRole: Long?,
  val language: String?
)