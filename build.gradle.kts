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
    // Core Spring AI (includes OpenRouter support via auto‑configuration)
    implementation("org.springframework.ai:spring-ai-starter")

    // OpenAI‑compatible model starter (optional; kept for completeness)
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

// Root project: no build tasks here. All logic lives in backend/build.gradle.kts.
