package com.imm.springai.tutor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Returns the real Java source file(s) backing a feature.
 * Files are loaded from classpath resources (bundled at build time in prod,
 * or from src/main/java in dev via classpath:file: URL).
 */
@RestController
@RequestMapping("/api/tutor/source")
public class SourceSnippetController {

    private final ResourceLoader resourceLoader;
    private final String sourceBasePath;

    public SourceSnippetController(
            ResourceLoader resourceLoader,
            @Value("${tutor.source-base:file:src/main/java/}") String sourceBasePath
    ) {
        this.resourceLoader = resourceLoader;
        this.sourceBasePath = sourceBasePath;
    }

    @GetMapping("/{featureId}")
    public ResponseEntity<?> getSource(@PathVariable String featureId) {
        String[] files = FILES.getOrDefault(featureId, new String[]{});
        if (files.length == 0) {
            Map<String, String> error = new LinkedHashMap<>();
            error.put("error", "feature-not-found");
            error.put("message", "No source files registered for feature: " + featureId);
            error.put("hint", "Feature ID not recognized. Available features: plain-chat, system-prompts, prompt-templates, streaming, metadata, structured-output, multimodality, tool-calling, chat-memory, advisors, embeddings, rag, moderation, mcp, observability, evaluation");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        var results = new java.util.ArrayList<Map<String, Object>>();
        for (String file : files) {
            try {
                Resource resource = resourceLoader.getResource(sourceBasePath + file);
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                Map<String, Object> fileData = new LinkedHashMap<>();
                fileData.put("file", file);
                fileData.put("content", content);
                fileData.put("size", content.length());
                results.add(fileData);
            } catch (IOException e) {
                Map<String, Object> fileData = new LinkedHashMap<>();
                fileData.put("file", file);
                fileData.put("error", "Could not read file: " + e.getMessage());
                results.add(fileData);
            }
        }
        return ResponseEntity.ok(results);
    }

    private static final java.util.Map<String, String[]> FILES = java.util.Map.ofEntries(
            entry("plain-chat",       "com/imm/springai/ChatController.java"),
            entry("system-prompts",   "com/imm/springai/ChatClientConfig.java"),
            entry("prompt-templates", "com/imm/springai/TutorController.java"),
            entry("streaming",        "com/imm/springai/TutorController.java"),
            entry("metadata",         "com/imm/springai/TutorController.java"),
            entry("structured-output","com/imm/springai/TutorController.java"),
            entry("multimodality",    "com/imm/springai/TutorController.java"),
            entry("tool-calling",     new String[]{"com/imm/springai/ToolController.java", "com/imm/springai/DateTimeTools.java"}),
            entry("chat-memory",      new String[]{"com/imm/springai/MemoryConfig.java", "com/imm/springai/MemoryController.java"}),
            entry("advisors",         "com/imm/springai/ChatClientConfig.java"),
            entry("embeddings",       "com/imm/springai/EmbeddingController.java"),
            entry("rag",              new String[]{"com/imm/springai/RagConfig.java", "com/imm/springai/RagController.java"}),
            entry("moderation",       "com/imm/springai/ModerationController.java"),
            entry("mcp",              "com/imm/springai/McpConfig.java"),
            entry("observability",    "com/imm/springai/ObservabilityConfig.java"),
            entry("evaluation",       "com/imm/springai/EvalController.java")
    );

    private static java.util.Map.Entry<String, String[]> entry(String k, String... v) {
        return java.util.Map.entry(k, v);
    }
}
