# Spring AI Tutor — Test Guide

Every feature has a curl command you can run to verify it works. Run these
from the project root while the server is running (`./gradlew bootRun`).

---

## 1. Plain Chat
```bash
curl "http://localhost:8080/ai?userInput=Tell%20me%20a%20joke"
```
Expected: Plain text joke response.

---

## 2. System Prompts
```bash
# Tutor persona
curl "http://localhost:8080/ai/system?userInput=What%20is%20RAG"

# Pirate persona
curl "http://localhost:8080/ai/pirate?userInput=What%20is%20RAG"
```
Expected: Different responses in each persona.

---

## 3. Prompt Templates
```bash
curl "http://localhost:8080/ai/template?topic=embeddings&level=junior"
```
Expected: 3-line explanation of embeddings for a junior dev.

---

## 4. Streaming
```bash
curl -N "http://localhost:8080/ai/stream?userInput=Write%20a%20short%20poem"
```
Expected: Tokens streamed line by line (use `-N` to disable buffering).

---

## 5. ChatResponse Metadata
```bash
curl "http://localhost:8080/ai/meta?userInput=Hello"
```
Expected: JSON with model, inputTokens, outputTokens, totalTokens, content.

---

## 6. Structured Output
```bash
# Single object
curl "http://localhost:8080/ai/structured"

# List
curl "http://localhost:8080/ai/structured/list"

# Strict (with schema validation)
curl "http://localhost:8080/ai/structured/strict"
```
Expected: JSON matching `ActorFilms` record (actor + movies list).

---

## 7. Multimodality
```bash
curl "http://localhost:8080/ai/image"
```
Expected: Text description of `multimodal.test.png`.

---

## 8. Tool Calling
```bash
curl "http://localhost:8080/ai/tool/time"
curl "http://localhost:8080/ai/tool/arithmetic"
```
Expected: Current time, or time calculation result.

---

## 9. Chat Memory
```bash
CID=demo-$(date +%s)
curl "http://localhost:8080/ai/chat?conversationId=$CID&userInput=My%20name%20is%20Iranna"
curl "http://localhost:8080/ai/chat?conversationId=$CID&userInput=What%20is%20my%20name"
curl "http://localhost:8080/ai/chat/messages?conversationId=$CID"
curl "http://localhost:8080/ai/chat/clear?conversationId=$CID"
```
Expected: Second call remembers the name; messages endpoint shows history.

---

## 10. Advisors
No direct endpoint — logging is automatic. Check server console for logs.

---

## 11. Embeddings
```bash
# Single embedding
curl "http://localhost:8080/ai/embed?text=Spring%20AI"

# Batch
curl "http://localhost:8080/ai/embed/batch?a=Spring&b=AI"

# Cosine similarity
curl "http://localhost:8080/ai/embed/similarity?a=cat&b=dog"

# Semantic FAQ search (real-world use case)
curl "http://localhost:8080/ai/embed/faq?q=How%20does%20search%20work"
curl "http://localhost:8080/ai/embed/faq?q=Tell%20me%20about%20streaming"
curl "http://localhost:8080/ai/embed/faq?q=What%20stores%20can%20I%20use"
```
Expected: Vector arrays, similarity score (0-1), or ranked FAQ results.

---

## 12. Vector Store + RAG
```bash
# Basic RAG
curl "http://localhost:8080/ai/rag?q=What%20is%20RAG"

# With threshold filter
curl "http://localhost:8080/ai/rag/filtered?q=embeddings&threshold=0.7"

# Debug — see retrieved docs
curl "http://localhost:8080/ai/rag/debug?q=Spring%20AI"
```
Expected: Answer based on retrieved docs, or debug info with scores.

---

## 13. Moderation
```bash
curl "http://localhost:8080/ai/moderation?text=This%20is%20a%20test"
```
Expected: JSON with `flagged`, `categories`, `categoryScores`, or a `note`
if moderation is unavailable (OpenRouter free tier).

---

## 14. MCP
No direct endpoint — requires adding MCP dependencies and uncommenting
`McpConfig.java`.

---

## 15. Observability
```bash
curl "http://localhost:8080/actuator/health"
curl "http://localhost:8080/actuator/metrics"
curl "http://localhost:8080/actuator/ai-metrics"
```
Expected: Health status, metrics list, or custom AI metrics summary.

---

## 16. Evaluation (LLM-as-a-Judge)
```bash
# Relevancy
curl "http://localhost:8080/ai/eval/relevancy?question=What%20is%20Java&answer=Java%20is%20a%20programming%20language"

# Fact-check
curl "http://localhost:8080/ai/eval/factcheck?context=Spring%20AI%20is%20a%20framework&answer=Spring%20AI%20is%20a%20framework"
```
Expected: PASS/FAIL verdict with one-sentence reason.

---

## Run all at once (quick smoke test)

```bash
#!/bin/bash
set -e

echo "=== 1. Plain Chat ==="
curl -s "http://localhost:8080/ai?userInput=hi" | head -c 80; echo

echo "=== 2. System Prompts ==="
curl -s "http://localhost:8080/ai/system?userInput=hi" | head -c 80; echo

echo "=== 3. Template ==="
curl -s "http://localhost:8080/ai/template?topic=java&level=junior" | head -c 80; echo

echo "=== 4. Metadata ==="
curl -s "http://localhost:8080/ai/meta?userInput=hi" | head -c 120; echo

echo "=== 5. Structured ==="
curl -s "http://localhost:8080/ai/structured" | head -c 120; echo

echo "=== 6. Embeddings ==="
curl -s "http://localhost:8080/ai/embed?text=test" | head -c 80; echo

echo "=== 7. Embedding Similarity ==="
curl -s "http://localhost:8080/ai/embed/similarity?a=cat&b=dog" | head -c 80; echo

echo "=== 8. Embedding FAQ ==="
curl -s "http://localhost:8080/ai/embed/faq?q=How%20does%20search%20work" | head -c 120; echo

echo "=== 9. RAG ==="
curl -s "http://localhost:8080/ai/rag?q=What%20is%20RAG" | head -c 80; echo

echo "=== 10. Moderation ==="
curl -s "http://localhost:8080/ai/moderation?text=test" | head -c 80; echo

echo "=== 11. Observability ==="
curl -s "http://localhost:8080/actuator/health" | head -c 80; echo

echo "=== 12. Evaluation ==="
curl -s "http://localhost:8080/ai/eval/relevancy?question=hi&answer=hello" | head -c 80; echo

echo "All smoke tests passed!"
```

---

## What to verify

- ✅ All endpoints return HTTP 200
- ✅ Responses match the expected JSON/text format
- ✅ No 500 errors in server logs
- ✅ Token counts are reasonable
- ✅ RAG returns context from `docs/spring-ai.md`
- ✅ Embedding similarity scores are between 0 and 1
- ✅ Chat memory persists across requests with same conversationId
- ✅ Structured output parses to the correct POJO