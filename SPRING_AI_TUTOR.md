# Spring AI 2.0.1 — Tutor Guide (Project: springai)

A walk-through of every major Spring AI feature, mapped to runnable code in
this project. Start the server once; then walk through each section in order.

---

## 0. Project baseline (already in place)

```
group = "com.imm"                         // com.imm.springai
Spring Boot 4.1.1 / Java 25
spring-ai-bom 2.0.1
spring-ai-starter-model-openai           // talking to OpenRouter (OpenAI-compatible)
spring-ai-starter-model-embedding        // (added in this guide for embeddings)
spring-ai-starter-vector-store-qdrant    // (optional, for RAG demo)
```

`application.properties` already has:
```
spring.ai.openai.api-key=sk-or-v1-...
spring.ai.openai.base-url=https://openrouter.ai/api/v1
spring.ai.openai.chat.options.model=minimax/minimax-m3:free
```

Note: `minimax/minimax-m3:free` is a small, free model on OpenRouter. Most
advanced Spring AI features (tool calling, structured output) work, but free
models are flaky with strict JSON schemas. If a demo returns malformed JSON,
swap to a stronger model (e.g. `openai/gpt-4o-mini`) for that test only.

### Start the server

```bash
./gradlew bootRun
```

You should see `Started SpringaiApplication` on port 8080.

---

## 1. Already implemented: the simplest chat

File: `ChatController.java` -> `GET /ai?userInput=...`

```java
this.chatClient.prompt().user(userInput).call().content();
```

Try it:
```bash
curl "http://localhost:8080/ai?userInput=Tell%20me%20a%20joke"
```

This is the ChatClient fluent API in its minimal form. Everything below extends
this.

---

## 2. Default system prompt (ChatClient defaults)

A ChatClient is immutable. Build it once with defaults, reuse for many calls.
Multiple ChatClient beans with different personas can coexist.

File: `ChatClientConfig.java`
```java
@Bean
ChatClient tutorChatClient(ChatClient.Builder builder) {
    return builder
            .defaultSystem("""
                    You are a Spring AI tutor. Be concise, give Java code examples.
                    If unsure, say so. Do not invent APIs that do not exist.
                    """)
            .defaultAdvisors(new SimpleLoggerAdvisor())
            .build();
}

@Bean
ChatClient pirateChatClient(ChatClient.Builder builder) {
    return builder
            .defaultSystem("""
                    You are a friendly chat bot that answers questions
                    in the voice of a Pirate. Keep answers short.
                    """)
            .build();
}
```

File: `TutorController.java` - Two endpoints using different ChatClients:

```java
@GetMapping("/ai/system")
String system(String userInput) {
    return tutor.prompt().user(userInput).call().content();
}

@GetMapping("/ai/pirate")
String pirate(String userInput) {
    return pirate.prompt().user(userInput).call().content();
}
```

Try it:
```bash
curl "http://localhost:8080/ai/system?userInput=What%20is%20RAG"
curl "http://localhost:8080/ai/pirate?userInput=What%20is%20RAG"
```

Concepts covered: `defaultSystem`, `defaultAdvisors`, fluent builder, immutable ChatClient, multiple personas.

---

## 3. Prompt templates with placeholders

Uses StringTemplate under the hood. Placeholders in `{}` are replaced at
call time.

File: `TutorController.java`
```java
@GetMapping("/ai/template")
String template(String topic, String level) {
    return tutor.prompt()
            .user(u -> u.text("Explain {topic} to a {level} Java developer in 3 lines.")
                    .param("topic", topic)
                    .param("level", level))
            .call()
            .content();
}
```

Try it:
```bash
curl "http://localhost:8080/ai/template?topic=embeddings&level=junior"
```

Concepts covered: `UserSpec.text(...).param(k,v)`, template rendering.

---

## 4. Streaming responses (Flux)

Streaming needs WebFlux on the classpath. WebFlux added in the guide.

```java
@GetMapping("/ai/stream")
Flux<String> stream(String userInput) {
    return tutor.prompt().user(userInput).stream().content();
}
```

Try it:
```bash
curl -N "http://localhost:8080/ai/stream?userInput=Write%20a%20short%20poem"
```

Concepts covered: `.stream().content()` returns `Flux<String>`. Must use
`spring-boot-starter-webflux` because streaming uses the reactive stack.

---

## 5. ChatResponse metadata (tokens, model, rate limits)

```java
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
```

Concepts covered: `chatResponse()` returns metadata; `usage` exposes token
counts that drive cost.

---

## 6. Structured Output -> POJO

Map LLM output to a Java record. No JSON parsing code in your controller.

```java
record ActorFilms(String actor, List<String> movies) {}

@GetMapping("/ai/structured")
ActorFilms structured() {
    return tutor.prompt()
            .user("Generate the filmography for a random actor. Return exactly one actor and 3 movies.")
            .call()
            .entity(ActorFilms.class);
}

/** A list response - requires ParameterizedTypeReference for generics. */
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
```

Try it:
```bash
curl "http://localhost:8080/ai/structured"
curl "http://localhost:8080/ai/structured/list"
curl "http://localhost:8080/ai/structured/strict"
```

Concepts covered: `.entity(Class)`, `ParameterizedTypeReference`, `BeanOutputConverter`, JSON schema
generation, self-correcting retries with `validateSchema()`, provider-enforced schema with `useProviderStructuredOutput()`.

---

## 7. Multimodality (image input)

Send text + an image, get a description.

```java
@GetMapping("/ai/image")
String image() {
    var img = new ClassPathResource("multimodal.test.png");
    return tutor.prompt()
            .user(u -> u.text("What do you see in this image?")
                    .media(MimeTypeUtils.IMAGE_PNG, img))
            .call()
            .content();
}
```

Add `src/main/resources/multimodal.test.png` (any small PNG).

Concepts covered: `Media`, `MimeTypeUtils.IMAGE_PNG`, `ClassPathResource`.

---

## 8. Tool Calling (function calling)

Expose Java methods to the model. The model decides when to call them.

File: `DateTimeTools.java`
```java
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
```

File: `ToolController.java` - Two tool endpoints:
```java
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
```

Behind the scenes `ToolCallingAdvisor` is auto-registered and runs the
tool loop until the model is done.

Try it:
```bash
curl "http://localhost:8080/ai/tool/time"
curl "http://localhost:8080/ai/tool/arithmetic"
```

Concepts covered: `@Tool`, `@ToolParam`, `ToolCallingAdvisor` (auto),
`ToolCallingManager` (advanced), multiple tools in one component.

---

## 9. Chat Memory (conversational state)

The model forgets each call by default. Memory makes it remember.

File: `MemoryConfig.java`
```java
@Bean
ChatMemory chatMemory() {
    return MessageWindowChatMemory.builder().maxMessages(20).build();
}
```

File: `MemoryController.java` - Three endpoints:
```java
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
```

Try a real conversation:
```bash
CID=demo-$(date +%s)
curl "http://localhost:8080/ai/chat?conversationId=$CID&userInput=My%20name%20is%20Iranna"
curl "http://localhost:8080/ai/chat?conversationId=$CID&userInput=What%20is%20my%20name"

# Inspect stored messages
curl "http://localhost:8080/ai/chat/messages?conversationId=$CID"

# Clear conversation
curl "http://localhost:8080/ai/chat/clear?conversationId=$CID"
```

Concepts covered: `ChatMemory`, `MessageWindowChatMemory`,
`MessageChatMemoryAdvisor`, `ChatMemory.CONVERSATION_ID` (REQUIRED parameter),
inspecting and clearing memory.

Production: swap `InMemoryChatMemoryRepository` for
`JdbcChatMemoryRepository` (Postgres/MySQL/etc.) by adding
`spring-ai-starter-model-chat-memory-repository-jdbc`.

---

## 10. Advisors API (the cross-cutting pattern)

An Advisor wraps the chat call. Common ones:

- `SimpleLoggerAdvisor` (logs request/response)
- `MessageChatMemoryAdvisor` (memory)
- `QuestionAnswerAdvisor` (RAG - deprecated)
- `ToolCallingAdvisor` (auto)
- `SafeGuardAdvisor` (block harmful input)
- `ReReadingAdvisor` (RE2 reasoning boost)

Add logging globally in `ChatClientConfig.java`:
```java
@Bean
ChatClient tutorChatClient(ChatClient.Builder builder) {
    return builder
            .defaultSystem("""
                    You are a Spring AI tutor. Be concise, give Java code examples.
                    If unsure, say so. Do not invent APIs that do not exist.
                    """)
            .defaultAdvisors(new SimpleLoggerAdvisor())
            .build();
}
```

Concepts covered: order (`Ordered.HIGHEST_PRECEDENCE` runs first on request
and LAST on response -- like a stack), advisor chain, `advisorContext`.

---

## 11. Embeddings

Turn text into a vector of floats. Used for similarity, RAG, search, recommendation systems, and more.

### Basic embedding endpoints

File: `EmbeddingController.java`

```java
@GetMapping("/ai/embed")
Map<String, Object> embed(String text) {
    float[] v = embeddingModel.embed(text);
    return Map.of(
            "input", text,
            "dimensions", v.length,
            "sample", Arrays.toString(Arrays.copyOf(v, 5))
    );
}

/** Embed a batch and show full response metadata. */
@GetMapping("/ai/embed/batch")
Map<String, Object> embedBatch(String a, String b) {
    EmbeddingResponse response = embeddingModel.embedForResponse(List.of(a, b));
    return Map.of(
            "model", response.getMetadata().getModel(),
            "count", response.getResults().size(),
            "dim", embeddingModel.dimensions()
    );
}

/**
 * Cosine similarity between two strings - a minimal "semantic search"
 * without a vector store.
 */
@GetMapping("/ai/embed/similarity")
Map<String, Object> similarity(String a, String b) {
    float[] v1 = embeddingModel.embed(a);
    float[] v2 = embeddingModel.embed(b);
    double dot = 0, n1 = 0, n2 = 0;
    for (int i = 0; i < v1.length; i++) {
        dot += v1[i] * v2[i];
        n1  += v1[i] * v1[i];
        n2  += v2[i] * v2[i];
    }
    return Map.of(
            "a", a,
            "b", b,
            "cosineSimilarity", dot / (Math.sqrt(n1) * Math.sqrt(n2))
    );
}
```

Try it:
```bash
curl "http://localhost:8080/ai/embed?text=Spring%20AI"
curl "http://localhost:8080/ai/embed/batch?a=Spring&b=AI"
curl "http://localhost:8080/ai/embed/similarity?a=cat&b=dog"
```

### Real-world use case: Semantic FAQ Search

The `/ai/embed/faq` endpoint demonstrates a **production use case**: finding the best FAQ answer for a user's question using semantic similarity — no keyword matching required.

```java
@GetMapping("/ai/embed/faq")
List<Map<String, Object>> faqSearch(String q) {
    float[] queryVec = embeddingModel.embed(q);

    var results = new ArrayList<Map<String, Object>>();
    for (Map<String, String> faq : FAQ) {
        float[] faqVec = embeddingModel.embed(faq.get("question"));
        double sim = cosineSimilarity(queryVec, faqVec);
        var entry = new LinkedHashMap<String, Object>();
        entry.put("question", faq.get("question"));
        entry.put("answer", faq.get("answer"));
        entry.put("score", Math.round(sim * 1000) / 1000.0);
        results.add(entry);
    }

    results.sort(Comparator.comparingDouble(e -> -(double) e.get("score")));
    return results.subList(0, Math.min(3, results.size()));
}
```

Try it — note how semantically similar questions match even without shared keywords:
```bash
# "continuous generation" matches "What is RAG?" semantically
curl "http://localhost:8080/ai/embed/faq?q=How%20does%20search%20work"

# "Tell me about streaming" matches "Does Spring AI support streaming?"
curl "http://localhost:8080/ai/embed/faq?q=Tell%20me%20about%20continuous%20generation"

# "What stores can I use" matches the vector store FAQ
curl "http://localhost:8080/ai/embed/faq?q=What%20stores%20can%20I%20use"
```

**Why this matters**: In production, you'd pre-compute embeddings for all FAQs at startup and store them in a **vector database** (Qdrant, PGVector, Pinecone). Vector stores use Approximate Nearest Neighbor (ANN) algorithms to make similarity searches blazing fast — O(log n) instead of O(n). This powers customer support bots, product discovery, and recommendation engines.

Concepts covered: `EmbeddingModel.embed(String)`, `.embedForResponse(List<String>)`, `.dimensions()`. Cosine similarity is done by you (or by the vector store).

---

## 12. Vector Store + RAG (Naive)

Spring AI ships 20+ vector store starters. For local dev, the simplest is
the in-memory SimpleVectorStore (Spring auto-configures it if on classpath).

ETL pipeline (run once at startup) - add to your config:
```java
@Bean
ApplicationRunner ingestDocs(VectorStore store, ResourceLoader rl) {
    return args -> {
        var doc = new TextReader(rl.getResource("classpath:docs/spring-ai.md")).get();
        var splitter = new TokenTextSplitter();
        store.write(splitter.split(doc));
    };
}
```

Add `src/main/resources/docs/spring-ai.md` with some text.

File: `RagController.java` - Three RAG endpoints:

```java
@GetMapping("/ai/rag")
String rag(@RequestParam String q) {
    // 1. Retrieve relevant documents from the vector store
    List<Document> docs = vectorStore.similaritySearch(
            SearchRequest.builder()
                    .query(q)
                    .topK(3)  // return top 3 most similar documents
                    .build()
    );

    // 2. Format documents as context
    String context = docs.stream()
            .map(d -> d.getText())
            .collect(Collectors.joining("\n\n"));

    // 3. Include context in prompt
    return ragClient.prompt()
            .user("Context:\n" + context + "\n\nQuestion: " + q)
            .call()
            .content();
}

/**
 * RAG with similarity threshold - only use documents above a certain score.
 *
 * Try: curl "http://localhost:8080/ai/rag/filtered?q=embeddings&threshold=0.7"
 */
@GetMapping("/ai/rag/filtered")
String ragFiltered(@RequestParam String q, @RequestParam(defaultValue = "0.7") double threshold) {
    List<Document> docs = vectorStore.similaritySearch(
            SearchRequest.builder()
                    .query(q)
                    .topK(5)
                    .similarityThreshold(threshold)
                    .build()
    );

    if (docs.isEmpty()) {
        return "I don't have relevant information about that.";
    }

    String context = docs.stream()
            .map(d -> d.getText())
            .collect(Collectors.joining("\n\n"));

    return ragClient.prompt()
            .user("Context:\n" + context + "\n\nQuestion: " + q)
            .call()
            .content();
}

/**
 * Debug endpoint: show what documents would be retrieved.
 *
 * Try: curl "http://localhost:8080/ai/rag/debug?q=Spring%20AI"
 */
@GetMapping("/ai/rag/debug")
Object ragDebug(@RequestParam String q) {
    List<Document> docs = vectorStore.similaritySearch(
            SearchRequest.builder()
                    .query(q)
                    .topK(3)
                    .build()
    );

    return docs.stream()
            .map(d -> {
                var info = new java.util.LinkedHashMap<String, Object>();
                info.put("id", d.getId());
                info.put("score", d.getMetadata().get("score"));
                info.put("text", d.getText().substring(0, Math.min(200, d.getText().length())) + "...");
                return info;
            })
            .collect(Collectors.toList());
}
```

Try it:
```bash
curl "http://localhost:8080/ai/rag?q=What%20is%20RAG"
curl "http://localhost:8080/ai/rag/filtered?q=embeddings&threshold=0.7"
curl "http://localhost:8080/ai/rag/debug?q=Spring%20AI"
```

Concepts covered: `DocumentReader` -> `TokenTextSplitter` ->
`VectorStore.write` -> `VectorStore.similaritySearch` for similarity search ->
manual prompt augmentation. In Spring AI 2.0.1, RAG is implemented manually
instead of using the deprecated `QuestionAnswerAdvisor`.

For a real DB, swap to `spring-ai-starter-vector-store-qdrant` (Docker) or
`spring-ai-starter-vector-store-pgvector` (Postgres).

---

## 13. Moderation

Detect unsafe content. Uses a `ModerationModel`.

File: `ModerationController.java`
```java
@RestController
class ModerationController {
    private final ModerationModel moderationModel;

    ModerationController(ModerationModel moderationModel) {
        this.moderationModel = moderationModel;
    }

    @GetMapping("/ai/moderation")
    Map<String, Object> moderate(@RequestParam String text) {
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
    }
}
```

Try it:
```bash
curl "http://localhost:8080/ai/moderation?text=This%20is%20a%20test"
```

Most providers (OpenAI, Mistral) ship moderation models; OpenRouter's free
tier may not. Expect this to need a paid key.

---

## 14. Model Context Protocol (MCP)

MCP is the "USB-C for tools" -- a standard for talking to external tool
servers. Spring AI has client + server starters.

- Client: `spring-ai-starter-mcp-client` -- consume tools from an MCP server
- Server: `spring-ai-starter-mcp-server` -- expose your `@Tool` methods as
  an MCP server (stdio / SSE / streamable-HTTP)

File: `McpConfig.java` demonstrates `@Tool` methods that can be exposed via
MCP server. To use MCP, uncomment the dependency and beans in `build.gradle.kts`:

```java
// In build.gradle.kts:
implementation("org.springframework.ai:spring-ai-starter-mcp-server")

// @Tool methods are auto-discovered by MCP server starter
@Configuration
class McpConfig {
    static class McpTools {
        @Tool(description = "Get the current date and time")
        String getDateTime() { return LocalDateTime.now().toString(); }
    }
}
```

See: https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html

---

## 15. Observability

Add `org.springframework.boot:spring-boot-starter-actuator` and
`io.micrometer:micrometer-tracing-bridge-otel`. Spring AI auto-instruments
ChatModel calls, advisor chains, tool executions, and vector store queries.

File: `ObservabilityConfig.java` adds a custom actuator endpoint at
`/actuator/ai-metrics` for a quick overview of Spring AI metrics.

### Available actuator endpoints:

- `/actuator/health` - Application health
- `/actuator/info` - Application info
- `/actuator/metrics` - Micrometer metrics
- `/actuator/prometheus` - Prometheus metrics
- `/actuator/ai-metrics` - Custom Spring AI metrics (chat calls, embedding calls, vector store calls)

### Configure in `application.properties`:

```properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus,ai-metrics
```

---

## 16. Model Evaluation / Testing

Spring AI 2.0 removed the dedicated Evaluator classes
(`RelevancyEvaluator`, `FactCheckingEvaluator`). The pattern that replaces
them is "ask the model" with a judging prompt (LLM-as-a-Judge).

File: `EvalController.java` - Two evaluation endpoints:

```java
/**
 * LLM-as-a-Judge: ask a second prompt "is this answer relevant?".
 * The model's reply is parsed as a boolean.
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
```

For unit tests, mock the `ChatModel` directly:
```java
@Test
void answersTheQuestion() {
    ChatModel model = mock(ChatModel.class);
    when(model.call(any(Prompt.class))).thenReturn(
        new ChatResponse(List.of(new Generation(new AssistantMessage("Paris")))));

    var c = ChatClient.create(model);
    assertThat(c.prompt().user("Capital of France?").call().content())
        .contains("Paris");
}
```

For end-to-end evaluation, Testcontainers starts a real model container.
Add `spring-ai-testcontainers` and use `OllamaContainer`.

Try it:
```bash
curl "http://localhost:8080/ai/eval/relevancy?question=What%20is%20Java&answer=Java%20is%20a%20programming%20language"
curl "http://localhost:8080/ai/eval/factcheck?context=Spring%20AI%20is%20a%20framework&answer=Spring%20AI%20is%20a%20framework"
```

---

## 17. Docker Compose dev-time services

`org.springframework.boot.docker-compose` -- if you add a `compose.yaml`,
Spring will start Postgres/Redis/Qdrant etc. before the app boots. Useful
for local dev of vector stores.

File: `compose.yaml` at project root

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: springai
      POSTGRES_USER: springai
      POSTGRES_PASSWORD: springai
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Usage:

```bash
docker compose up -d
./gradlew bootRun
```

Add `org.springframework.boot:spring-boot-docker-compose` to the
classpath for auto-startup of these services before the app boots.
For Qdrant vector store, uncomment the `qdrant` service in compose.yaml
and add `spring-ai-starter-vector-store-qdrant`.

---

## Suggested end-to-end learning order

1. Plain chat (already done)
2. System prompts (default + Pirate persona)
3. Prompt templates (placeholders)
4. Streaming (Flux)
5. ChatResponse metadata (tokens)
6. Structured output (POJO + list + strict)
7. Multimodality (image)
8. Tool calling (one tool, then arithmetic)
9. Chat memory (conversational)
10. Advisors (logger)
11. Embeddings (single + batch + similarity)
12. Vector store + RAG (ingest a small doc, ask about it)
13. Moderation
14. MCP (optional, deeper dive)
15. Observability (metrics endpoint)
16. Evaluation (LLM-as-a-Judge + mock)

For each: implement -> restart `./gradlew bootRun` -> curl the endpoint.
