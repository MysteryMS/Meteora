import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("io.spring.dependency-management") version "1.0.9.RELEASE"
    id ("org.springframework.boot") version "2.3.2.RELEASE"
    kotlin ("jvm") version "1.3.72"
    kotlin("plugin.spring") version "1.3.72"
}

group "com.mystery"
version "2020.09-STABLE"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    implementation ("io.sentry:sentry:1.7.30")
    implementation ("net.dv8tion:JDA:4.2.0_175")
    implementation ("org.reflections:reflections:0.9.12")
    implementation ("org.springframework.boot:spring-boot-starter-web")
    implementation ("org.litote.kmongo:kmongo:4.0.3")
    implementation ("io.ktor:ktor-server-core:1.3.2")
    implementation ("org.jsoup:jsoup:1.13.1")
    implementation ("com.beust:klaxon:5.0.1")
    implementation ("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation ("org.jetbrains.kotlin:kotlin-reflect")
    implementation ("com.sedmelluq:lavaplayer:1.3.50")
    implementation ("com.auth0:java-jwt:3.10.3")
    testImplementation ("junit:junit:4.13")

}

tasks.named<Test>("test") {
    useJUnitPlatform()
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "11"
    }
}

tasks.test {
    useJUnit()

    maxHeapSize = "1G"
}
