# Spring AI Tutor - Implementation Plan
## Based on spring-ai-tour-ui-ux-improvement-plan.md

### Current State Analysis
The project has strong foundations:
- 16 fully implemented features with data, architecture diagrams, code diffs, checkpoints
- Health check, local lab status, setup doctor, download functionality
- Progress tracking via localStorage
- Basic navigation structure (Home, Learn, Lab, Docs)

### Major Implementation Gaps

#### Phase 1 — UX Foundation (Priority P0)
1. **Lesson Template & Three-Column Layout**
   - Replace single-column FeaturePage with three-column workspace:
     - Learning Sidebar (current implementation needs lesson-level integration)
     - Lesson Content area (with proper lesson template)
     - Lab/Playground area (persistent local lab integration)
   - Chapter header with: Chapter XX, Title, ⭐ Difficulty, ⏱ Duration, 💻 Type, Prerequisites
   - Previous/Next navigation between lessons (not just features)
   - Breadcrumbs navigation
   - Progress tracking at lesson level

2. **Prerequisite System**
   - Enhanced prerequisite awareness showing what to review
   - Integration with lesson progression (can't start lesson without prerequisites)
   - "Review prerequisite" links that navigate directly to needed lessons

#### Phase 2 — Local Lab (Priority P0)
1. **Setup Wizard/Guide Improvements**
   - 6-step guided experience: Download → Open project → Configure provider → Run Spring Boot → Connect website → Run first lab
   - Actionable fixes for common failures (e.g., "Port 8080 unavailable - Change port in application.properties")

2. **API Inspector Tab**
   - Three-tab view: Local Request | Spring AI Request | Model Response
   - Shows actual HTTP request flow from browser → Spring Boot app → Spring AI abstraction → LLM provider
   - Auto-populated with current feature's request/response data

3. **Runtime Timeline/Logs View**
   - Real-time timeline showing: Request received → ChatClient invoked → Advisor chain executed → ChatModel invoked → Model response received → Response returned
   - Expandable events for advanced users
   - Visual indication of advisor execution order

4. **Lab Enhancements**
   - Chat Playground connected to local Spring Boot instance
   - Code preview with [Copy] [Open in IDE] [Run] actions
   - Local server status with detailed diagnostics (Chat Model, Embedding Model, Vector Store, Moderation, Actuator)

#### Phase 3 — Interactive Learning (Priority P0)
1. **Four Learning Views Per Feature**
   - Concept: Explain the idea (problem → solution)
   - API: Spring AI abstractions and configuration
   - Code: Java implementation with before/after comparisons
   - Runtime: What actually happens when the application runs

2. **Interactive Architecture Diagrams**
   - Clickable components with detailed explanations
   - Java/Spring analogy cards as a signature feature
   - Progressive disclosure (Basic/Advanced/Internals sections)

3. **Three Learning Modes**
   - Learn: For beginners (concepts, analogies, diagrams, simple explanations)
   - Build: For hands-on (code, labs, exercises, local execution)
   - Deep Dive: For experienced (internals, architecture, advanced APIs, performance)

#### Phase 4 — Full Curriculum (Priority P0)
- Complete 40+ lessons covering all phases:
  - Phase 0: Prerequisites (What is LLM, Tokens, Prompt, Context, Temperature, Embeddings, Vector search, RAG, Tool calling, Agents, MCP)
  - Phase 1: Fundamentals (What is Spring AI, Project setup, First model call, ChatModel, ChatClient, Prompt, Prompt templates, Streaming, Structured output, Model options)
  - Phase 2: Models (Chat models, Embedding models, Image generation, Audio, Speech, Moderation, Multimodal, Provider abstraction)
  - Phase 3: Data (Document, Document readers, Document transformers, Text splitters, Embeddings, VectorStore, Similarity search, Metadata filtering)
  - Phase 4: RAG (What is RAG, RAG architecture, Basic RAG, Retrieval, Question answering, Advisors, Advanced RAG, Query transformation, Retrieval strategies, RAG evaluation)
  - Phase 5: Advisors & Memory (Advisors, Advisor chain, Chat memory, Conversation memory, VectorStore-backed memory, Custom advisors)
  - Phase 6: Tool Calling (Tool calling concept, @Tool, Tool parameters, Tool callbacks, Tool execution, Multiple tools, Tool errors, Tool calling loop, Tools + memory, Tools + RAG)
  - Phase 7: Agents (What is an agent, Agent loop, Tool-driven agents, Planning, Multi-step execution, Agent safety)
  - Phase 8: MCP (What is MCP, MCP architecture, MCP client, MCP server, MCP tools, MCP resources, MCP prompts, Spring AI MCP integration, Build an MCP server, Consume an MCP server)
  - Phase 9: Production (Auto configuration, Observability, Logging, Metrics, Evaluation, Security, Cost, Performance, Error handling, Provider switching, Production architecture)
  - Phase 10: Capstone (Spring AI Support Assistant implementation)

#### Phase 5 — Advanced Features (Priority P1)
1. **Learning-Oriented Search**
   - Returns: Concept explanation, Architecture diagram, Java example, Interactive lab, Related concepts, Official documentation
   - Categories: Concept, API, Example, Lab, Troubleshooting, Official Docs

2. **Knowledge Map**
   - Visual SVG/graph showing Spring AI components and their relationships
   - Clickable nodes that navigate to relevant lessons
   - Shows connections between Models, ChatClient, Data, RAG, Tools, Memory, Agents, MCP, Production

3. **Version Management**
   - Per-lesson version badges showing Spring AI version, Spring Boot version, Java version
   - Version selector dropdown
   - Explicit warnings when examples differ by version

4. **Provider Strategy**
   - Start with one recommended provider (Ollama - Local)
   - Later introduce provider abstraction
   - Teaching objective: Application → Spring AI abstraction → Provider

#### Phase 6 — Capstone (Priority P1)
1. **Final Capstone Project**
   - Spring AI Support Assistant implementing:
     - RAG for document retrieval
     - Tool Calling for Java API access
     - Memory for conversation context
     - MCP for external tool integration
     - Observability and Evaluation
     - Structured output
   - Local execution with validation
   - Requirements and guided architecture

2. **Final Knowledge Assessment**
   - Readiness dashboard showing mastery % per phase
   - Final challenge testing architecture and implementation
   - Completion dashboard with metrics

### Implementation Approach

#### Quick Wins (Next 1-2 weeks)
1. Implement three-column lesson workspace layout (Task #1)
2. Enhance LessonHeader with chapter info, objectives, analogies (Task #2)
3. Implement Concept/API/Code/Runtime tabs (Task #3)
4. Add API Inspector and Runtime Timeline views (Tasks #4-5)

#### Medium Term (2-4 weeks)
1. Expand curriculum to full 40+ lessons (Task #6) ✓ COMPLETED
2. Implement Setup Wizard improvements (Task #7)
3. Add progressive disclosure and interactive architecture (Task #8)

#### Longer Term (4-6 weeks)
1. Implement Search, Knowledge Map, Version management (Task #9)
2. Build final capstone and knowledge assessment (Task #10)

### Success Metrics
- Lesson completion rate > 70%
- Time from landing page to first successful AI response < 5 minutes
- Lab connection success rate > 90%
- Number of local lab sessions and executed examples
- Final challenge success rate > 60%
- Setup failure rate < 10%

### Definition of Done
A topic is complete only when it has:
- ✓ Concept explanation
- ✓ Why it exists
- ✓ Java/Spring analogy
- ✓ Architecture diagram
- ✓ Spring AI API explanation
- ✓ Working Java example
- ✓ Local execution
- ✓ Request/response visibility
- ✓ Hands-on exercise
- ✓ Checkpoint
- ✓ Related concepts
- ✓ Official documentation reference

A complete course additionally requires:
- ✓ Full curriculum coverage
- ✓ Progress tracking
- ✓ Local Lab
- ✓ Final capstone
- ✓ Final assessment
- ✓ Production topics
- ✓ Version awareness

This plan transforms Spring AI Tour from a feature-based demo site into a true interactive learning environment where Java/Spring Boot developers can progress from "I know Java and Spring Boot, but I don't know Spring AI" to "I can design, implement, debug, and explain Spring AI applications in production."