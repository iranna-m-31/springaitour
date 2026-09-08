package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Section 16 of the tutor guide - LLM-as-a-Judge evaluation.
 *
 * Spring AI 2.0 removed the dedicated Evaluator classes
 * (RelevancyEvaluator, FactCheckingEvaluator). The pattern that replaces
 * them is just "ask the model" with a judging prompt. This controller
 * shows two common judging prompts:
 *
 *   - /ai/eval/relevancy  - is the answer addressing the question?
 *   - /ai/eval/factcheck  - is the answer grounded in the supplied context?
 *
 * For unit tests, mock the ChatModel directly. For end-to-end evaluation,
 * add spring-ai-spring-boot-testcontainers and use an Ollama container.
 * See Spring AI reference: "Evaluation" section.
 */
@RestController
class EvalController {

    private final ChatClient judge;

    EvalController(ChatClient tutorChatClient) {
        this.judge = tutorChatClient;
    }

    /**
     * @param question the question being evaluated
     * @param answer the answer to evaluate
     * @return Map with question, answer, and verdict (PASS/FAIL with reason)
     * See Spring AI reference: "Evaluation" section
     */
    @GetMapping("/ai/eval/relevancy")
    Map<String, Object> relevancy(String question, String answer) {
        String verdict = judge.prompt()
                .system("""
                        You are an evaluation judge. You will be given a question
                        and an answer. Reply with EXACTLY one of:
                          PASS - if the answer addresses the question
                          FAIL - if the answer does not address the question
                        followed by a one-sentence reason.
                        """)
                .user("Question: " + question + "\n\nAnswer: " + answer)
                .call()
                .content();
        return Map.of(
                "question", question,
                "answer", answer,
                "verdict", verdict.trim()
        );
    }

    /**
     * @param context the reference context paragraph
     * @param answer the answer to fact-check
     * @return Map with context, answer, and verdict (PASS/FAIL with reason)
     * See Spring AI reference: "Evaluation" section
     */
    @GetMapping("/ai/eval/factcheck")
    Map<String, Object> factcheck(String context, String answer) {
        String verdict = judge.prompt()
                .system("""
                        You are a fact-checking judge. You will be given a
                        context paragraph and a candidate answer. Reply with
                        EXACTLY one of:
                          PASS - if the answer is supported by the context
                          FAIL - if the answer contradicts or is unsupported
                        followed by a one-sentence reason.
                        """)
                .user("Context: " + context + "\n\nAnswer: " + answer)
                .call()
                .content();
        return Map.of(
                "context", context,
                "answer", answer,
                "verdict", verdict.trim()
        );
    }
}
