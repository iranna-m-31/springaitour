plugins {
	java
	id("org.springframework.boot") version "4.1.1"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.imm"
version = "0.0.1-SNAPSHOT"
description = "springai"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(25)
	}
}

repositories {
	mavenCentral()
}

extra["springAiVersion"] = "2.0.1"

dependencies {
	// Core Spring AI model starter (OpenAI-compatible, includes OpenRouter support)
	implementation("org.springframework.ai:spring-ai-starter-model-openai")

	// Spring Boot Web (required for REST endpoints)
	implementation("org.springframework.boot:spring-boot-starter-web")

	// WebFlux is only needed if you use Flux<String> streaming endpoints (e.g. /ai/stream).
	// Keep it commented unless you need streaming.
	// implementation("org.springframework.boot:spring-boot-starter-webflux")

	// Actuator for health/metrics (optional but recommended)
	implementation("org.springframework.boot:spring-boot-starter-actuator")

	// Commons used by Spring AI 2.0.1 internals
	implementation("org.springframework.ai:spring-ai-commons")

	// Vector store integration
	implementation("org.springframework.ai:spring-ai-vector-store")

	// Test utilities
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

dependencyManagement {
	imports {
		mavenBom("org.springframework.ai:spring-ai-bom:${property("springAiVersion")}")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

// Load .env file and pass to bootRun
tasks.bootRun {
	dependsOn("uiBuild")
	val envFile = file(".env")
	if (envFile.exists()) {
		envFile.readLines()
			.filter { it.isNotBlank() && !it.startsWith('#') }
			.map { it.split('=', limit = 2) }
			.filter { it.size == 2 }
			.forEach { (key, value) ->
				environment[key.trim()] = value.trim()
			}
	}
}

// Build the React UI into src/main/resources/static before running the server
val pnpmExecutable = System.getenv("PNPM_EXECUTABLE")?.let { "$it" }
	?: "/Users/irannam/.nvm/versions/node/v24.11.0/bin/pnpm"

tasks.register<Exec>("uiBuild") {
	workingDir = file("../spring-ai-ui")
	environment("SPRING_BOOT_BUILD", "true")
	commandLine(pnpmExecutable, "run", "build")
	group = "application"
	description = "Build the React UI into src/main/resources/static"
}

// bootJar should also build the UI so the JAR includes the latest frontend
tasks.named("bootJar") {
	dependsOn("uiBuild")
}
