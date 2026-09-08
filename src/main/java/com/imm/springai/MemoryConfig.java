package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Section 9 of the tutor guide - chat memory.
 *
 * A separate ChatClient bean is created with a memory advisor as a
 * default, so every call from MemoryController has memory wired in.
 *
 * The advisor REQUIRES the ChatMemory.CONVERSATION_ID parameter; the
 * controller passes it from the request.
 *
 * For production: swap InMemoryChatMemoryRepository for the JDBC one
 * by adding spring-ai-starter-model-chat-memory-repository-jdbc.
 * See Spring AI reference: "Chat Memory" section.
 */
@Configuration
class MemoryConfig {

    /**
     * @return an in-memory ChatMemory keeping the last 20 messages per conversation
     * See Spring AI reference: "Chat Memory" section
     */
    @Bean
    ChatMemory chatMemory() {
        return MessageWindowChatMemory.builder()
                .maxMessages(20)
                .build();
    }

    /**
     * @param builder the ChatClient builder injected by Spring Boot
     * @param chatMemory the ChatMemory bean to wire in via MessageChatMemoryAdvisor
     * @return a ChatClient bean with conversational memory enabled
     * See Spring AI reference: "Chat Memory" section
     */
    @Bean
    ChatClient memoryChatClient(ChatClient.Builder builder, ChatMemory chatMemory) {
        return builder
                .defaultSystem("You are a helpful assistant with conversational memory.")
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }
}
