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
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	// WebFlux is required for streaming responses (.stream().content()).
	// Without it, /ai/stream will not compile.
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("org.springframework.boot:spring-boot-starter-actuator")

	// OpenAI starter gives us ChatModel + EmbeddingModel + ChatMemory beans
	// (the autoconfigure for chat memory is included in this starter).
	implementation("org.springframework.ai:spring-ai-starter-model-openai")

	// spring-ai-commons contains TextReader and TokenTextSplitter
	// (the new home for the ETL classes in 2.0.1).
	implementation("org.springframework.ai:spring-ai-commons")

	// SimpleVectorStore + SearchRequest live here.
	// No autoconfigure starter exists; we wire the VectorStore bean manually.
	implementation("org.springframework.ai:spring-ai-vector-store")

	// Section 14: MCP (Model Context Protocol) - optional, for tool servers
	// Uncomment when you need to consume/serve MCP tools
	// implementation("org.springframework.ai:spring-ai-starter-mcp-client")
	// implementation("org.springframework.ai:spring-ai-starter-mcp-server")

	// Section 15: Observability via Micrometer tracing (auto-instrumentation for Spring AI)
	implementation("io.micrometer:micrometer-tracing-bridge-otel")

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
val pnpmExecutable = System.getenv("NVM_BIN")?.let { "$it/pnpm" }
	?: "/Users/irannam/.nvm/versions/node/v24.11.0/bin/pnpm"

tasks.register<Exec>("uiBuild") {
	workingDir = file("springai-tutor-ui")
	environment("SPRING_BOOT_BUILD", "true")
	commandLine(pnpmExecutable, "run", "build")
	group = "application"
	description = "Build the React UI into src/main/resources/static"
}

// bootJar should also build the UI so the JAR includes the latest frontend
tasks.named("bootJar") {
	dependsOn("uiBuild")
}
