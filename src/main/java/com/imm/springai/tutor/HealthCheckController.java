package com.imm.springai.tutor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Reports the runtime config of the app so the UI can show a setup banner
 * and a read-only Settings page. Never returns the raw API key.
 */
@RestController
@RequestMapping("/api/tutor")
public class HealthCheckController {

    private final String apiKey;
    private final String baseUrl;
    private final String chatModel;
    private final String embeddingModel;
    private final String vectorStore;
    private final boolean moderationEnabled;
    private final boolean actuatorEnabled;

    public HealthCheckController(
            @Value("${spring.ai.openai.api-key:}") String apiKey,
            @Value("${spring.ai.openai.base-url:}") String baseUrl,
            @Value("${spring.ai.openai.chat.options.model:}") String chatModel,
            @Value("${spring.ai.openai.embedding.options.model:}") String embeddingModel,
            @Value("${tutor.vector-store:simple}") String vectorStore,
            @Value("${tutor.moderation-enabled:false}") boolean moderationEnabled,
            @Value("${management.endpoints.web.exposure.include:health,info,metrics}") String actuatorEndpoints
    ) {
        this.apiKey = apiKey == null ? "" : apiKey;
        this.baseUrl = baseUrl;
        this.chatModel = chatModel;
        this.embeddingModel = embeddingModel;
        this.vectorStore = vectorStore;
        this.moderationEnabled = moderationEnabled;
        this.actuatorEnabled = !actuatorEndpoints.isBlank();
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("apiKeyConfigured", !apiKey.isBlank());
        body.put("apiKeyPreview", maskKey(apiKey));
        body.put("baseUrl", baseUrl);
        body.put("chatModel", chatModel);
        body.put("embeddingModel", embeddingModel);
        body.put("vectorStore", vectorStore);
        body.put("moderationEnabled", moderationEnabled);
        body.put("actuatorEnabled", actuatorEnabled);
        body.put("status", apiKey.isBlank() ? "needs-setup" : "ready");
        return body;
    }

    private String maskKey(String key) {
        if (key == null || key.isBlank()) return "";
        if (key.length() < 8) return "****";
        return key.substring(0, 7) + "••••" + key.substring(key.length() - 4);
    }
}
