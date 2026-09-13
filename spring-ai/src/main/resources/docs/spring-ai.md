# Spring AI Tutor — RAG Documents

This is the RAG (Retrieval Augmented Generation) document for the Spring AI Tutor tutorial.

## Overview

The Spring AI Tutor provides 16 interactive modules covering:
- Foundations: Plain chat, system prompts, prompt templates, streaming, metadata
- Core Features: Structured output, multimodality, tool calling, chat memory, advisors API
- Advanced Patterns: Embeddings, vector store + RAG, moderation
- Specialized Topics: Model Context Protocol (MCP), observability, evaluation

## How RAG Works

Each module includes:
- A live "Try It" panel to call real API endpoints
- Actual Spring AI source code with key lines highlighted
- Example curl commands for manual API calls

## Ingestion Notes

This document was automatically ingested into the in-memory vector store at application startup.
If you need to re-ingest after changing the content:

1. Stop the application: `./gradlew bootRun` (Ctrl+C) or `kill <pid>`
2. Ensure your OpenRouter API key is configured in `.env`
3. Restart the application: `./gradlew bootRun`
4. Verify ingestion via the `/ai/rag/debug` endpoint

## Vector Store Configuration

- **Store**: Simple in-memory vector store (for demo purposes)
- **Embedding Model**: Uses the OpenAI-compatible model configured via `spring.ai.openai.embedding.options.model`
- **Similarity**: Default cosine similarity for document retrieval

## Module References

| Module | Focus | Code Highlights |
|--------|-------|----------------|
| 1 | Plain Chat | Basic LLM chat endpoint |
| 5 | RAG Search | Vector store search endpoint |
| 9 | Structured Output | JSON response parsing |
| 12 | Tool Calling | Function calling examples |
