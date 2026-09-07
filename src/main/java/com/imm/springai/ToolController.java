package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Section 8 of the tutor guide - tool calling.
 *
 * Note: ToolCallingAdvisor is auto-registered by DefaultChatClient.
 * We just have to pass the tool instances via .tools(...).
 */
@RestController
class ToolController {

    private final ChatClient tutor;
    private final DateTimeTools dateTimeTools;

    ToolController(ChatClient tutorChatClient, DateTimeTools dateTimeTools) {
        this.tutor = tutorChatClient;
        this.dateTimeTools = dateTimeTools;
    }

    @GetMapping("/ai/tool/time")
    String whatTimeIsIt() {
        return tutor.prompt()
                .user("What time is it right now?")
                .tools(dateTimeTools)
                .call()
                .content();
    }

    @GetMapping("/ai/tool/arithmetic")
    String addThreeHours() {
        return tutor.prompt()
                .user("If it's 2026-01-15T10:00:00, what time will it be in 3 hours?")
                .tools(dateTimeTools)
                .call()
                .content();
    }
}
