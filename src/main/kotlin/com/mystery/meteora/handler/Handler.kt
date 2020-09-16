package com.mystery.meteora.handler

import com.mystery.meteora.controller.Config
import com.mystery.meteora.controller.translate
import com.mystery.meteora.handler.annotations.Command
import com.mystery.meteora.handler.annotations.Hidden
import com.mystery.meteora.handler.events.MessageEvent
import com.mystery.meteora.handler.modules.BaseModule
import com.mystery.meteora.handler.modules.Commands
import com.mystery.meteora.handler.modules.Modules
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import org.reflections.Reflections
import kotlin.reflect.KClass
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.functions
import kotlin.reflect.full.hasAnnotation
import kotlin.reflect.full.primaryConstructor

class Handler(jda: JDA) {

  companion object {
    var modules: List<Modules> = listOf()
      private set
    fun executeCommand(message: String, context: MessageReceivedEvent, prefix: String, config: Config?) {
      if (context.author.isBot) return
      if (message.startsWith(prefix)) {
        val msgFormat = message.substring(prefix.length, message.length)
        val messageSplit = msgFormat.split(" ")
        for (modulesFind in modules) {
          for (commandsFind in modulesFind.commands) {
            if (commandsFind.names.find { x ->
                x == messageSplit[0]
              } != null) {
              val args = msgFormat.substring(messageSplit[0].length, msgFormat.length).trim()
              commandsFind.commandFunction.call(modulesFind.moduleClass.primaryConstructor?.call(context, args, prefix, config))
              return
            }
          }
        }
      } else if (message.startsWith(context.jda.selfUser.asMention) || message.startsWith("<@!704182418571264020>")) {
        context.channel.sendMessage("global.mention".translate(config, context.guild.id, context.author.asMention, prefix, prefix)).queue()
      }
    }
  }

  init {
    jda.addEventListener(MessageEvent())
  }

  @ExperimentalStdlibApi
  fun addModules(packageLocation: String) {
    val classHierarchy = Reflections(packageLocation).getSubTypesOf(BaseModule::class.java)
    val tempList = mutableListOf<Modules>()
    for (classJava in classHierarchy) {
      val moduleTemp = classJava.kotlin as KClass<*>
      if (moduleTemp.hasAnnotation<com.mystery.meteora.handler.annotations.Module>()) {
        val tempCommandsList = mutableListOf<Commands>()
        for (tempCmd in moduleTemp.functions) {
          if (tempCmd.hasAnnotation<Command>()) {
            val cmdAnnotation = tempCmd.findAnnotation<Command>()
            val cmdVisible = !tempCmd.hasAnnotation<Hidden>()
            tempCommandsList.add(Commands(cmdAnnotation?.names!!.toList().toTypedArray(), cmdVisible, tempCmd))
          }
        }
        val moduleAnnotation =
          moduleTemp.findAnnotation<com.mystery.meteora.handler.annotations.Module>()
        tempList.add(
          Modules(
            moduleAnnotation!!.name,
            moduleTemp,
            moduleAnnotation.category,
            !moduleTemp.hasAnnotation<Hidden>(),
            tempCommandsList
          )
        )
      }
    }
    modules = tempList
  }

  @ExperimentalStdlibApi
  fun addModules(mainClass: KClass<*>) {
    val name = mainClass.qualifiedName?.split(".")
    val nameFinal = name?.get(name.count() - 1)?.length?.let {
      mainClass.qualifiedName!!.substring(
        0,
        mainClass.qualifiedName!!.length - (it + 1)
      )
    }
    if (nameFinal != null) {
      addModules(nameFinal)
    }
  }
}