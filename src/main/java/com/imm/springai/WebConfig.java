package com.imm.springai;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configures CORS for the AI endpoints so the Vercel frontend
 * and local dev server can call the Spring Boot backend.
 * See Spring AI reference: "CORS" section.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * @param registry the CORS registry to configure
     * See Spring AI reference: "CORS" section
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/ai/**")
            .allowedOrigins(
                "https://springaitour.vercel.app",
                "http://localhost:5173",
                "http://localhost:8080"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(false)
            .maxAge(3600);
    }
}
