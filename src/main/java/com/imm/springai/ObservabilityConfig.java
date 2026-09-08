package com.imm.springai;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Section 15 of the tutor guide - Observability.
 *
 * Spring AI auto-instruments ChatModel calls, advisor chains, tool executions,
 * and vector store queries when micrometer-tracing-bridge-otel is on the classpath.
 *
 * Metrics are available at /actuator/metrics and /actuator/prometheus.
 * This adds a custom /actuator/ai-metrics endpoint for a quick overview.
 * See Spring AI reference: "Observability" section.
 */
@Configuration
class ObservabilityConfig {

    /**
     * Custom actuator endpoint at /actuator/ai-metrics showing chat call stats.
     * Spring AI auto-registers metrics for:
     * - spring.ai.chat.client.calls (count)
     * - spring.ai.chat.client.errors (count)
     * - spring.ai.embedding.calls (count)
     * - spring.ai.vector.store.calls (count)
     * - token usage histograms
     * @param registry the Micrometer MeterRegistry for reading counters
     * @return a SpringAiMetricsEndpoint registered at /actuator/ai-metrics
     * See Spring AI reference: "Observability" section
     */
    @Bean
    SpringAiMetricsEndpoint springAiMetricsEndpoint(MeterRegistry registry) {
        return new SpringAiMetricsEndpoint(registry);
    }

    /**
     * @Endpoint exposing Spring AI metrics via Actuator.
     * See Spring AI reference: "Observability" section.
     */
    @Endpoint(id = "aimetrics")
    static class SpringAiMetricsEndpoint {

        private final MeterRegistry registry;

        SpringAiMetricsEndpoint(MeterRegistry registry) {
            this.registry = registry;
        }

        /**
         * @return Map with chatCalls, chatErrors, embeddingCalls, vectorStoreCalls
         * See Spring AI reference: "Observability" section
         */
        @ReadOperation
        Map<String, Object> metrics() {
            var result = new LinkedHashMap<String, Object>();
            result.put("chatCalls", count("spring.ai.chat.client.calls"));
            result.put("chatErrors", count("spring.ai.chat.client.errors"));
            result.put("embeddingCalls", count("spring.ai.embedding.calls"));
            result.put("vectorStoreCalls", count("spring.ai.vector.store.calls"));
            return result;
        }

        private Double count(String name) {
            var counter = registry.find(name).counter();
            return counter != null ? counter.count() : null;
        }
    }
}