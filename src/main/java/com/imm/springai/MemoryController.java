package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Section 9 - chat memory.
 *
 * Try a two-turn conversation with the same conversationId:
 *
 *   curl ".../ai/chat?conversationId=demo-1&userInput=My%20name%20is%20Iranna"
 *   curl ".../ai/chat?conversationId=demo-1&userInput=What%20is%20my%20name"
 */
@RestController
class MemoryController {

    private final ChatClient memoryClient;
    private final ChatMemory chatMemory;

    MemoryController(ChatClient memoryChatClient, ChatMemory chatMemory) {
        this.memoryClient = memoryChatClient;
        this.chatMemory = chatMemory;
    }

    @GetMapping("/ai/chat")
    String chat(@RequestParam String conversationId, @RequestParam String userInput) {
        return memoryClient.prompt()
                .user(userInput)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();
    }

    /** Inspect the messages currently stored for a conversation. */
    @GetMapping("/ai/chat/messages")
    Object messages(@RequestParam String conversationId) {
        return chatMemory.get(conversationId).stream()
                .map(m -> Map.of(
                        "type", m.getMessageType().name(),
                        "content", m.getText()))
                .toList();
    }

    /** Clear a conversation. */
    @GetMapping("/ai/chat/clear")
    String clear(@RequestParam String conversationId) {
        chatMemory.clear(conversationId);
        return "cleared " + conversationId;
    }
}
