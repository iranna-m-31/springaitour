package com.imm.springai;

import org.springframework.ai.moderation.Moderation;
import org.springframework.ai.moderation.ModerationModel;
import org.springframework.ai.moderation.ModerationPrompt;
import org.springframework.ai.moderation.ModerationResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

/**
 * Section 13 of the tutor guide - Moderation.
 *
 * ModerationModel detects unsafe/harmful content. Most providers (OpenAI,
 * Mistral) ship moderation models. OpenRouter's free tier may not support
 * it — the call will return a "not found" error gracefully.
 */
@RestController
class ModerationController {

    private final ModerationModel moderationModel;

    ModerationController(ModerationModel moderationModel) {
        this.moderationModel = moderationModel;
    }

    @GetMapping("/ai/moderation")
    Map<String, Object> moderate(@RequestParam String text) {
        try {
            Moderation result = moderationModel.call(
                    new ModerationPrompt(text)).getResult().getOutput();

            // Get first result (most models return a single moderation result)
            Optional<ModerationResult> firstResult = result.getResults().stream().findFirst();

            return Map.of(
                    "input", text,
                    "flagged", firstResult.map(ModerationResult::isFlagged).orElse(false),
                    "categories", firstResult.map(ModerationResult::getCategories).orElse(null),
                    "categoryScores", firstResult.map(ModerationResult::getCategoryScores).orElse(null)
            );
        } catch (Exception e) {
            // Moderation not supported on this provider / free tier.
            // Return a safe default rather than a 500 error.
            return Map.of(
                    "input", text,
                    "flagged", false,
                    "categories", null,
                    "categoryScores", null,
                    "note", "Moderation unavailable for this provider — upgrade API key or use OpenAI/Mistral for moderation."
            );
        }
    }
}