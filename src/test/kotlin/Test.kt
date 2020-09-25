import org.junit.Test
import java.util.*

class Test {
  private var exception = "Missing translation for locale %s!"
  private fun checkLocales(): Boolean {
    val englishBundle = ResourceBundle.getBundle("commands", Locale("en", "us"))
    val portugueseBundle = ResourceBundle.getBundle("commands", Locale("pt", "br"))
    var shouldPass = true

    for (item in englishBundle.keys) {
      val key = portugueseBundle.getString(item)
      if (key.isEmpty() || key == englishBundle.getString(item)) {
        exception = exception.format(item)
        shouldPass = false
      }
    }
    return shouldPass
  }

  @Test
  fun test() {
    assert(checkLocales()) { exception }
  }
}
