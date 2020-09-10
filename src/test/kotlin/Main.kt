import kotlin.random.Random

fun main() {
    val msgNum = List(1) { Random.nextInt(1, 3) }
    println(msgNum[0])
}