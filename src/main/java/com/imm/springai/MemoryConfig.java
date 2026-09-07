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
 */
@Configuration
class MemoryConfig {

    @Bean
    ChatMemory chatMemory() {
        return MessageWindowChatMemory.builder()
                .maxMessages(20)
                .build();
    }

    @Bean
    ChatClient memoryChatClient(ChatClient.Builder builder, ChatMemory chatMemory) {
        return builder
                .defaultSystem("You are a helpful assistant with conversational memory.")
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }
}
