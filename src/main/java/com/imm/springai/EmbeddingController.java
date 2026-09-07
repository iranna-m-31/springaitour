package com.imm.springai;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Section 11 of the tutor guide - embeddings.
 *
 * EmbeddingModel.embed(String) returns a float[] - the vector representation
 * of the text. Cosine similarity between two vectors measures semantic
 * closeness; the math is left to the caller (or to a vector store).
 */
@RestController
class EmbeddingController {

    private final EmbeddingModel embeddingModel;

    /**
     * A tiny hardcoded FAQ — in production this lives in a database
     * and is embedded once at startup, then stored in a vector store.
     */
    private static final List<Map<String, String>> FAQ = List.of(
            Map.of("question", "What is Spring AI?",
                   "answer",  "Spring AI provides a portable abstraction layer for AI features across multiple providers."),
            Map.of("question", "How do embeddings work?",
                   "answer",  "Embeddings convert text into a vector of floats. Semantically similar text produces similar vectors."),
            Map.of("question", "What is RAG?",
                   "answer",  "RAG (Retrieval Augmented Generation) fetches relevant documents and feeds them into the LLM prompt."),
            Map.of("question", "How do I use tool calling?",
                   "answer",  "Annotate a method with @Tool and pass it to the ChatClient via .tools()."),
            Map.of("question", "Does Spring AI support streaming?",
                   "answer",  "Yes. Use .stream().content() on the ChatClient to get a Flux<String>."),
            Map.of("question", "What vector stores are supported?",
                   "answer",  "Spring AI supports 20+ stores including Qdrant, PGVector, Redis, and an in-memory SimpleVectorStore.")
    );

    EmbeddingController(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

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

    /**
     * REAL-WORLD USE CASE: semantic FAQ search.
     *
     * Instead of keyword matching ("What is RAG" only matches if the
     * keyword "RAG" appears), we embed the user's question and find
     * the FAQ with the most similar vector — even if the words differ.
     *
     * Try these to see semantic matching in action:
     *   curl "http://localhost:8080/ai/embed/faq?q=How%20does%20search%20work"
     *   curl "http://localhost:8080/ai/embed/faq?q=Tell%20me%20about%20continuous%20generation"
     *   curl "http://localhost:8080/ai/embed/faq?q=What%20stores%20can%20I%20use"
     */
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

    private double cosineSimilarity(float[] a, float[] b) {
        double dot = 0, n1 = 0, n2 = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            n1  += a[i] * a[i];
            n2  += b[i] * b[i];
        }
        return dot / (Math.sqrt(n1) * Math.sqrt(n2));
    }
}
