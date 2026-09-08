package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Section 12 of the tutor guide - RAG (Retrieval Augmented Generation).
 *
 * Demonstrates the manual RAG pattern: retrieve relevant documents from a
 * VectorStore, then include them as context in the LLM prompt.
 * See Spring AI reference: "Vector Store" and "RAG" sections.
 */
@RestController
class RagController {

    private final VectorStore vectorStore;
    private final ChatClient ragClient;

    RagController(VectorStore vectorStore, ChatClient.Builder builder) {
        this.vectorStore = vectorStore;
        this.ragClient = builder
                .defaultSystem("""
                        You are a tutor answering questions about Spring AI.
                        Use ONLY the context provided in the user message.
                        If the context does not contain the answer, say "I don't know".
                        """)
                .defaultAdvisors(new SimpleLoggerAdvisor())
                .build();
    }

    /**
     * @param q question to search documents for
     * @return the LLM's answer based on the top 3 retrieved documents
     * See Spring AI reference: "Vector Store" / "RAG" sections
     */
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
     * @param q question to search documents for
     * @param threshold minimum similarity score; documents below it are excluded
     * @return the LLM's answer based on documents above the threshold, or a fallback message if none match
     * See Spring AI reference: "Vector Store" / "similarityThreshold" sections
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
     * @param q question to search documents for
     * @return list of {id, score, text} maps for the top 3 retrieved documents (debug view)
     * See Spring AI reference: "Vector Store" / "similaritySearch" sections
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
}