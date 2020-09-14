import java.util.*

fun test(): Boolean {
    val englishBundle = ResourceBundle.getBundle("commands", Locale("en", "us"))
    val portugueseBundle = ResourceBundle.getBundle("commands", Locale("pt", "br"))

    for (item in englishBundle.keys) {
        return !portugueseBundle.containsKey(item)
    }
    return true
}
