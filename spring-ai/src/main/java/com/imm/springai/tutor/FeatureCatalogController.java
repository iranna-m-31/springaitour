package com.imm.springai.tutor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Returns all 16 feature definitions as structured JSON.
 * The frontend mirrors these as a typed array for compile-time safety.
 */
@RestController
@RequestMapping("/api/tutor")
public class FeatureCatalogController {

    @GetMapping("/features")
    public List<Map<String, Object>> features() {
        return List.of(
            feature("plain-chat", 1, "Plain Chat", "GET", "/ai",
                "The simplest chat endpoint. Send a user prompt and get the LLM's response as plain text.",
                List.of("ChatClient", "prompt()", "call()"),
                new String[]{}, "text", false, false),
            feature("system-prompts", 2, "System Prompts", "GET", "/ai/system",
                "ChatClient is immutable — build it once with defaults and reuse it. Multiple ChatClient beans with different personas can coexist.",
                List.of("ChatClient.Builder", "defaultSystem()", "defaultAdvisors()"),
                new String[]{"ChatClientConfig.java"}, "text", false, false),
            feature("prompt-templates", 3, "Prompt Templates", "GET", "/ai/template",
                "StringTemplate under the hood. Placeholders in {placeholder} are replaced at call time.",
                List.of("StringTemplate", "UserSpec.text()", ".param()"),
                new String[]{"TutorController.java"}, "text", false, false),
            feature("streaming", 4, "Streaming Responses", "GET", "/ai/stream",
                "Returns a Flux<String> — tokens stream as they are generated. Uses WebFlux. Ideal for long responses.",
                List.of("Flux", "stream()", "WebFlux"),
                new String[]{"TutorController.java"}, "stream", false, false),
            feature("metadata", 5, "ChatResponse Metadata", "GET", "/ai/meta",
                "Token usage (input, output, total), model name, and rate limits. Essential for cost tracking.",
                List.of("ChatResponse", "Generation", "Usage"),
                new String[]{"TutorController.java"}, "json", false, false),
            feature("structured-output", 6, "Structured Output → POJO", "GET", "/ai/structured",
                "Map LLM output directly to a Java record. No JSON parsing. Use .entity(Class) or ParameterizedTypeReference for lists.",
                List.of(".entity()", "BeanOutputConverter", "validateSchema()", "useProviderStructuredOutput()"),
                new String[]{"TutorController.java"}, "json", false, false),
            feature("multimodality", 7, "Multimodality (Image Input)", "GET", "/ai/image",
                "Send text + an image and get a description. The model must support vision.",
                List.of("Media", "MimeTypeUtils", "ClassPathResource"),
                new String[]{"TutorController.java"}, "text", false, false),
            feature("tool-calling", 8, "Tool Calling", "GET", "/ai/tool/time",
                "Expose Java methods to the model. @Tool marks methods, @ToolParam provides hints. ToolCallingAdvisor runs the tool loop automatically.",
                List.of("@Tool", "@ToolParam", "ToolCallingAdvisor"),
                new String[]{"ToolController.java", "DateTimeTools.java"}, "text", false, false),
            feature("chat-memory", 9, "Chat Memory", "GET", "/ai/chat",
                "ChatMemory makes the model remember across turns. Use conversationId to scope conversations.",
                List.of("ChatMemory", "MessageWindowChatMemory", "MessageChatMemoryAdvisor", "CONVERSATION_ID"),
                new String[]{"MemoryConfig.java", "MemoryController.java"}, "text", false, false),
            feature("advisors", 10, "Advisors API", "GET", "/ai",
                "Advisors wrap the chat call — cross-cutting concerns like logging, memory, RAG, safety. SimpleLoggerAdvisor logs every request/response.",
                List.of("Advisor", "SimpleLoggerAdvisor", "MessageChatMemoryAdvisor", "Ordered"),
                new String[]{"ChatClientConfig.java"}, "text", false, false),
            feature("embeddings", 11, "Embeddings", "GET", "/ai/embed",
                "Turn text into a vector of floats. Similar meaning → similar vectors. Used for semantic search, RAG, and recommendation engines.",
                List.of("EmbeddingModel", ".embed()", "cosineSimilarity", "SimpleVectorStore"),
                new String[]{"EmbeddingController.java"}, "json", false, false),
            feature("rag", 12, "Vector Store + RAG", "GET", "/ai/rag",
                "RAG fetches relevant documents and feeds them into the LLM prompt. SimpleVectorStore is in-memory; swap to Qdrant/PGVector for production.",
                List.of("DocumentReader", "TokenTextSplitter", "VectorStore.write", "similaritySearch", "Qdrant", "PGVector"),
                new String[]{"RagConfig.java", "RagController.java"}, "text", true, false),
            feature("moderation", 13, "Moderation", "GET", "/ai/moderation",
                "Detect unsafe/harmful content. OpenRouter's free tier may not support it — returns a graceful 'not available' response.",
                List.of("ModerationModel", "ModerationPrompt", "ModerationResult"),
                new String[]{"ModerationController.java"}, "json", false, true),
            feature("mcp", 14, "Model Context Protocol (MCP)", "GET", "/ai",
                "MCP is the USB-C for tools — a standard for connecting LLMs to external tool servers. Spring AI has client and server starters.",
                List.of("MCP", "spring-ai-starter-mcp-client", "spring-ai-starter-mcp-server"),
                new String[]{"McpConfig.java"}, "text", false, false),
            feature("observability", 15, "Observability", "GET", "/actuator/health",
                "Micrometer tracing with OpenTelemetry bridge. Spring AI auto-instruments ChatModel, advisor chains, tools, and vector stores.",
                List.of("Micrometer", "OpenTelemetry", "actuator", "ai-metrics"),
                new String[]{"ObservabilityConfig.java"}, "json", false, false),
            feature("evaluation", 16, "Model Evaluation / Testing", "GET", "/ai/eval/relevancy",
                "LLM-as-a-Judge — ask a second prompt to evaluate the first answer. Relevancy and fact-check judges.",
                List.of("LLM-as-a-Judge", "PASS/FAIL", "mock(ChatModel)", "Testcontainers"),
                new String[]{"EvalController.java"}, "json", false, false)
        );
    }

    private Map<String, Object> feature(
            String id, int section, String title, String method, String path,
            String description, List<String> concepts, String[] sourceFiles,
            String responseType, boolean requiresDocker, boolean requiresPaidKey
    ) {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("id", id);
        f.put("section", section);
        f.put("title", title);
        f.put("method", method);
        f.put("path", path);
        f.put("description", description);
        f.put("concepts", concepts);
        f.put("sourceFiles", List.of(sourceFiles));
        f.put("responseType", responseType);
        f.put("requiresDocker", requiresDocker);
        f.put("requiresPaidKey", requiresPaidKey);
        return f;
    }
}
