# Spring AI - Quick Reference

Spring AI is a framework for building AI-powered applications in Java. It
provides a portable abstraction layer across many AI providers, so you can
swap models without rewriting your application.

## Chat Models

Chat models take a prompt and return a text response. Spring AI supports
OpenAI, Anthropic, Google Gemini, Mistral, Ollama, Amazon Bedrock, Azure
OpenAI, and many more, all behind a single ChatModel interface.

Use ChatClient (the fluent API) for most work. The minimal call is:

    chatClient.prompt().user("hi").call().content();

For streaming, call .stream() instead of .call() and return a Flux.

## Embeddings

Embedding models turn text into a vector of floats. Two pieces of text with
similar meaning will have vectors that are close together in the vector
space. This is the foundation of semantic search and RAG.

## RAG - Retrieval Augmented Generation

RAG is the pattern of stuffing relevant context into the prompt before
sending it to the model. The flow is:

1. Read documents (PDF, Markdown, HTML, JSON, ...)
2. Split them into chunks
3. Embed each chunk and store in a vector database
4. When a user asks a question, embed the question, find the most similar
   chunks, and prepend them to the prompt
5. Send the augmented prompt to the LLM

Spring AI ships a QuestionAnswerAdvisor that does steps 4 and 5 for you.

## Tool Calling

LLMs cannot access real-time data or take actions on their own. Tool
calling lets you expose a Java method to the model; the model can then
decide to call it. Common uses:

- Look up the current time
- Query a database
- Call an internal API
- Run a calculation

Annotate the method with @Tool, and ChatClient will register it via
ToolCallingAdvisor automatically.

## Chat Memory

A chat model is stateless by default. Chat memory stores the conversation
so the model can refer to earlier turns. Use MessageWindowChatMemory for a
simple sliding-window implementation, or plug in a JDBC/Cassandra/Neo4j
repository for persistence.

Always pass a conversationId via ChatMemory.CONVERSATION_ID.

## Structured Output

LLMs return text, but you usually want a Java object. Use .entity(Class)
to have Spring AI generate a JSON schema, instruct the model, and parse
the result. For lists use ParameterizedTypeReference.

## MCP - Model Context Protocol

MCP is a standard for AI tools. Spring AI ships both client and server
implementations, so you can consume tools from external MCP servers or
expose your own @Tool methods as an MCP server.
