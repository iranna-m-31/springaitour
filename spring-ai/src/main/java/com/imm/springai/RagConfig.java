package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;

import java.util.List;

/**
 * Section 12 of the tutor guide - RAG with the simple in-memory vector store.
 *
 * On startup, the ApplicationRunner reads src/main/resources/docs/spring-ai.md,
 * splits it into chunks, and writes them to the VectorStore.
 *
 * In Spring AI 2.0.1, RAG is done using VectorStoreRetriever instead of
 * QuestionAnswerAdvisor. You manually retrieve relevant documents and
 * include them in the prompt.
 *
 * For production, swap SimpleVectorStore for Qdrant, PGVector, or any of
 * the 20+ supported stores by changing the dependency.
 */
@Configuration
class RagConfig {

    /**
     * SimpleVectorStore is in-memory only - good for demos and tests,
     * not for production. Requires an EmbeddingModel bean (auto-wired
     * by the OpenAI starter).
     */
    @Bean
    VectorStore vectorStore(EmbeddingModel embeddingModel) {
        return SimpleVectorStore.builder(embeddingModel).build();
    }

    /**
     * One-shot document ingestion on app start.
     *
     * Wrapped in try-catch so the app starts even if the embedding API
     * key limit is exceeded. You can manually trigger ingestion by:
     * 1. Calling ./gradlew bootRun again after fixing your API key
     * 2. Using the /ai/rag/debug endpoint to test queries (will show empty results)
     * 3. Manually calling vectorStore.write() via a @PostConstruct method
     */
    @Bean
    ApplicationRunner ingestDocs(VectorStore vectorStore, ResourceLoader resourceLoader) {
        return args -> {
            try {
                var resource = resourceLoader.getResource("classpath:docs/spring-ai.md");
                var docs = new TextReader(resource).get();
                var splitter = TokenTextSplitter.builder().build();
                vectorStore.write(splitter.split(docs));
                System.out.println("✅ RAG documents ingested successfully");
            } catch (Exception e) {
                System.err.println("⚠️  RAG ingestion skipped during startup: " + e.getMessage());
                System.err.println("   The app will start but RAG will return no results until documents are ingested.");
                System.err.println("   Fix your API key limit at: https://openrouter.ai/workspaces/default/keys");
                System.err.println("   Then restart the app or manually trigger ingestion.");
            }
        };
    }
}
