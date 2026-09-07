package com.imm.springai;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Section 8 of the tutor guide.
 *
 * @Tool exposes a Java method to the model. ToolCallingAdvisor is
 * auto-registered by ChatClient, finds tools in the context, and runs
 * the call loop until the model responds without a tool call.
 */
@Component
class DateTimeTools {

    @Tool(description = "Get the current date and time in the user's timezone, ISO-8601 format")
    String now() {
        return LocalDateTime.now()
                .atZone(LocaleContextHolder.getTimeZone().toZoneId())
                .toString();
    }

    @Tool(description = "Add hours to a given ISO-8601 datetime and return the result")
    String addHours(
            @ToolParam(description = "ISO-8601 datetime, e.g. 2026-01-15T10:00:00") String when,
            @ToolParam(description = "Number of hours to add") int hours) {
        return LocalDateTime.parse(when, DateTimeFormatter.ISO_DATE_TIME)
                .plusHours(hours)
                .toString();
    }
}
