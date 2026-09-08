package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Spring AI Tutor — the main application entry point.
 * <p>
 * This Spring Boot application demonstrates 16 Spring AI features:
 * 1. Plain Chat — minimal ChatClient usage
 * 2. System Prompts — default system prompts on ChatClient
 * 3. Prompt Templates — StringTemplate placeholders
 * 4. Streaming — WebFlux Flux<String> responses
 * 5. Metadata — token usage and model info
 * 6. Structured Output — POJO mapping with .entity()
 * 7. Multimodality — image + text input
 * 8. Tool Calling — @Tool methods exposed to the LLM
 * 9. Chat Memory — conversation history across turns
 * 10. Advisors API — cross-cutting concerns (logging, memory, RAG)
 * 11. Embeddings — text-to-vector for semantic search
 * 12. RAG — retrieval-augmented generation with VectorStore
 * 13. Moderation — content safety detection
 * 14. MCP — Model Context Protocol for external tools
 * 15. Observability — Micrometer + OpenTelemetry metrics
 * 16. Evaluation — LLM-as-a-Judge pattern
 */
@SpringBootApplication
public class SpringaiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringaiApplication.class, args);
    }

}
