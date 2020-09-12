import com.sedmelluq.discord.lavaplayer.tools.PlayerLibrary
import kotlin.random.Random

fun main() {
    val msgNum = List(1) { Random.nextInt(1, 3) }
    return println(PlayerLibrary.VERSION)
}