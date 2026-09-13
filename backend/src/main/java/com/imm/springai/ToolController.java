package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Section 8 of the tutor guide - tool calling.
 *
 * Exposes Java methods to the LLM so it decides when to call them.
 * @Tool marks a method as callable; @ToolParam provides parameter hints.
 * ToolCallingAdvisor runs the tool loop automatically.
 * See Spring AI reference: "Tool Calling" section.
 */
@RestController
class ToolController {

    private final ChatClient tutor;
    private final DateTimeTools dateTimeTools;

    ToolController(ChatClient tutorChatClient, DateTimeTools dateTimeTools) {
        this.tutor = tutorChatClient;
        this.dateTimeTools = dateTimeTools;
    }

    /**
     * @return the current time as reported by the LLM using the injected DateTimeTools bean
     * See Spring AI reference: "Tool Calling" section
     */
    @GetMapping("/ai/tool/time")
    String whatTimeIsIt() {
        return tutor.prompt()
                .user("What time is it right now?")
                .tools(dateTimeTools)
                .call()
                .content();
    }

    /**
     * @return the result of adding three hours to the hardcoded time via DateTimeTools
     * See Spring AI reference: "Tool Calling" section
     */
    @GetMapping("/ai/tool/arithmetic")
    String addThreeHours() {
        return tutor.prompt()
                .user("If it's 2026-01-15T10:00:00, what time will it be in 3 hours?")
                .tools(dateTimeTools)
                .call()
                .content();
    }
}
