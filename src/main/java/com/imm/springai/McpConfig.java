package com.imm.springai;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * Section 14 of the tutor guide - MCP (Model Context Protocol).
 *
 * MCP is the "USB-C for AI tools" - a standard for talking to external
 * tool servers. Spring AI provides both client and server implementations.
 *
 * This config defines @Tool methods that can be exposed as an MCP server
 * using spring-ai-starter-mcp-server dependency.
 *
 * See: https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html
 */
@Configuration
class McpConfig {

    /**
     * Example tools that could be served via MCP server.
     * Add spring-ai-starter-mcp-server to the classpath and
     * these will be auto-exposed as MCP tools (stdio, SSE, or
     * streamable-HTTP protocol).
     */
    static class McpTools {

        @Tool(description = "Get the current date and time")
        String getDateTime() {
            return LocalDateTime.now().toString();
        }

        @Tool(description = "Get a random weather report for a city")
        String getWeather(String city) {
            Random random = new Random();
            int temp = 15 + new Random().nextInt(20);
            return String.format("The weather in %s is %d°C and partly cloudy.", city, temp);
        }
    }
}