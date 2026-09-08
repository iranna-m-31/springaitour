package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

/**
 * Sections 2 through 7 of the tutor guide.
 *
 *  2. Default system prompt
 *  3. Prompt templates with {placeholders}
 *  4. Streaming responses (Flux)
 *  5. ChatResponse metadata (token usage)
 *  6. Structured output -> POJO
 *  7. Multimodality (image input)
 */
@RestController
class TutorController {

    private final ChatClient tutor;
    private final ChatClient pirate;

    TutorController(ChatClient tutorChatClient, ChatClient pirateChatClient) {
        this.tutor = tutorChatClient;
        this.pirate = pirateChatClient;
    }

    // ---------------------------------------------------------------------
    // 2. System prompt
    // ---------------------------------------------------------------------

    /**
     * @param userInput message to send to the tutor ChatClient
     * @return response from the tutor-prefixed ChatClient
     * See Spring AI reference: "ChatClient" section
     */
    @GetMapping("/ai/system")
    String system(String userInput) {
        return tutor.prompt().user(userInput).call().content();
    }

    /**
     * @param userInput message to send to the pirate ChatClient
     * @return response from the pirate-prefixed ChatClient
     * See Spring AI reference: "ChatClient" section
     */
    @GetMapping("/ai/pirate")
    String pirate(String userInput) {
        return pirate.prompt().user(userInput).call().content();
    }

    // ---------------------------------------------------------------------
    // 3. Prompt templates
    // ---------------------------------------------------------------------

    /**
     * @param topic the topic to explain
     * @param level the target audience experience level
     * @return a 3-line explanation in the specified tone
     * See Spring AI reference: "Prompt Templates" section
     */
    @GetMapping("/ai/template")
    String template(String topic, String level) {
        return tutor.prompt()
                .user(u -> u.text("Explain {topic} to a {level} Java developer in 3 lines.")
                        .param("topic", topic)
                        .param("level", level))
                .call()
                .content();
    }

    // ---------------------------------------------------------------------
    // 4. Streaming
    // ---------------------------------------------------------------------

    /**
     * @param userInput message to stream as tokens
     * @return a Flux of token strings streamed in real-time
     * See Spring AI reference: "Streaming" section
     */
    @GetMapping("/ai/stream")
    Flux<String> stream(String userInput) {
        return tutor.prompt().user(userInput).stream().content();
    }

    // ---------------------------------------------------------------------
    // 5. ChatResponse metadata
    // ---------------------------------------------------------------------

    /**
     * @param userInput message to send
     * @return Map with model, inputTokens, outputTokens, totalTokens, content
     * See Spring AI reference: "ChatResponse" section
     */
    @GetMapping("/ai/meta")
    Map<String, Object> meta(String userInput) {
        ChatResponse r = tutor.prompt().user(userInput).call().chatResponse();
        var usage = r.getMetadata().getUsage();
        Generation gen = r.getResult();
        return Map.of(
                "model", r.getMetadata().getModel(),
                "inputTokens", usage.getPromptTokens(),
                "outputTokens", usage.getCompletionTokens(),
                "totalTokens", usage.getTotalTokens(),
                "content", gen.getOutput().getText()
        );
    }

    // ---------------------------------------------------------------------
    // 6. Structured output
    // ---------------------------------------------------------------------

    record ActorFilms(String actor, List<String> movies) {}

    /**
     * @return an ActorFilms record populated by the LLM — no JSON parsing needed
     * See Spring AI reference: "Structured Output" section
     */
    @GetMapping("/ai/structured")
    ActorFilms structured() {
        return tutor.prompt()
                .user("Generate the filmography for a random actor. Return exactly one actor and 3 movies.")
                .call()
                .entity(ActorFilms.class);
    }

    /**
     * @return a list of ActorFilms records — uses ParameterizedTypeReference for generic types
     * See Spring AI reference: "Structured Output" section
     */
    @GetMapping("/ai/structured/list")
    List<ActorFilms> structuredList() {
        return tutor.prompt()
                .user("Generate filmographies for 2 random actors. 2 movies each.")
                .call()
                .entity(new ParameterizedTypeReference<List<ActorFilms>>() {});
    }

    /**
     * Use the reliability switches - this is what you want when the model is
     * flaky. validateSchema() retries on parse failure; useProviderStructuredOutput()
     * asks the provider to enforce the schema at the API level.
     * @return an ActorFilms record with provider-level schema enforcement
     * See Spring AI reference: "Structured Output" section
     */
    @GetMapping("/ai/structured/strict")
    ActorFilms structuredStrict() {
        return tutor.prompt()
                .user("Generate the filmography for a random actor. Return exactly one actor and 3 movies.")
                .call()
                .entity(ActorFilms.class, spec -> spec
                        .useProviderStructuredOutput()
                        .validateSchema());
    }

    // ---------------------------------------------------------------------
    // 7. Multimodality
    // ---------------------------------------------------------------------

    /**
     * @return a text description of the multimodal.test.png image
     * See Spring AI reference: "Multimodality" section
     */
    @GetMapping("/ai/image")
    String image() {
        var img = new ClassPathResource("multimodal.test.png");
        return tutor.prompt()
                .user(u -> u.text("What do you see in this image?")
                        .media(MimeTypeUtils.IMAGE_PNG, img))
                .call()
                .content();
    }
}
