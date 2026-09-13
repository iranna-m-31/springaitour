package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Section 9 of the tutor guide - chat memory.
 *
 * Demonstrates how ChatMemory makes the model remember conversations across turns.
 * Use conversationId to scope conversations. In production, swap InMemoryChatMemoryRepository
 * for JdbcChatMemoryRepository.
 * See Spring AI reference: "Chat Memory" section.
 */
@RestController
class MemoryController {

    private final ChatClient memoryClient;
    private final ChatMemory chatMemory;

    MemoryController(ChatClient memoryChatClient, ChatMemory chatMemory) {
        this.memoryClient = memoryChatClient;
        this.chatMemory = chatMemory;
    }

    /**
     * @param conversationId unique conversation identifier
     * @param userInput message to send in this turn
     * @return the model's response, which may include information from previous turns in this conversation
     * See Spring AI reference: "Chat Memory" section
     */
    @GetMapping("/ai/chat")
    String chat(@RequestParam String conversationId, @RequestParam String userInput) {
        return memoryClient.prompt()
                .user(userInput)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();
    }

    /**
     * @param conversationId unique conversation identifier
     * @return list of messages currently stored for this conversation (for inspection only)
     * See Spring AI reference: "Chat Memory" section
     */
    @GetMapping("/ai/chat/messages")
    Object messages(@RequestParam String conversationId) {
        return chatMemory.get(conversationId).stream()
                .map(m -> Map.of(
                        "type", m.getMessageType().name(),
                        "content", m.getText()))
                .toList();
    }

    /**
     * @param conversationId unique conversation identifier to clear
     * @return confirmation message indicating the conversation was cleared
     * See Spring AI reference: "Chat Memory" section
     */
    @GetMapping("/ai/chat/clear")
    String clear(@RequestParam String conversationId) {
        chatMemory.clear(conversationId);
        return "cleared " + conversationId;
    }
}
