package com.mystery.meteora.controller.model

data class ConfigModel(
    val clientConfig: Client,
    val databaseConfig: Database,
    val apiTokens: APITokens
)