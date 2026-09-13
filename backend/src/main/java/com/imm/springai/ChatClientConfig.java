package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Section 2 + 10 of the tutor guide.
 *
 * Demonstrates:
 *  - default system prompt on the ChatClient
 *  - default advisors (logging)
 *  - multiple ChatClient beans with different personas
 * See Spring AI reference: "ChatClient" section.
 */
@Configuration
public class ChatClientConfig {

    /**
     * @param builder the ChatClient builder injected by Spring Boot
     * @return a ChatClient bean with a tutor persona and SimpleLoggerAdvisor
     * See Spring AI reference: "ChatClient" section
     */
    @Bean
    ChatClient tutorChatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem("""
                        You are a Spring AI tutor. Be concise, give Java code examples.
                        If unsure, say so. Do not invent APIs that do not exist.
                        """)
                .defaultAdvisors(new SimpleLoggerAdvisor())
                .build();
    }

    /**
     * @param builder the ChatClient builder injected by Spring Boot
     * @return a ChatClient bean with a pirate persona (no default advisors)
     * See Spring AI reference: "ChatClient" section
     */
    @Bean
    ChatClient pirateChatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem("""
                        You are a friendly chat bot that answers questions
                        in the voice of a Pirate. Keep answers short.
                        """)
                .build();
    }
}