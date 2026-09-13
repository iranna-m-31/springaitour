package com.imm.springai;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

/**
 * Configures CORS for the AI endpoints so the Vercel frontend
 * and local dev server can call the Spring Boot backend.
 * CORS origins can be set via the CORS_ALLOWED_ORIGINS environment variable,
 * formatted as a comma-separated list. Falls back to sensible defaults.
 * See Spring AI reference: "CORS" section.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final List<String> DEFAULT_ALLOWED_ORIGINS = List.of(
        "https://spring-ai-ui.vercel.app",
        "https://springaitour.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080"
    );

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Read allowed origins from environment variable, fall back to defaults
        String corsEnv = System.getenv("CORS_ALLOWED_ORIGINS");
        List<String> allowedOrigins;
        if (corsEnv != null && !corsEnv.isBlank()) {
            allowedOrigins = Arrays.asList(corsEnv.split(","));
        } else {
            allowedOrigins = DEFAULT_ALLOWED_ORIGINS;
        }

        // Cover both /ai/** and /api/** endpoints for CORS
        String[] patterns = {"/ai/**", "/api/**"};
        for (String pattern : patterns) {
            registry.addMapping(pattern)
                .allowedOrigins(allowedOrigins.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
        }
    }
}
