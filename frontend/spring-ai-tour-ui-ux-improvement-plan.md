# Spring AI Tour --- UI/UX Improvement & Product Development Plan

## 1. Product Vision

### Goal

Transform Spring AI Tour from a documentation-style website into an
**interactive learning environment for Java/Spring Boot developers who
are new to Spring AI**.

The target learner should be able to start with:

> "I know Java and Spring Boot, but I don't know Spring AI."

and finish with:

> "I can design, implement, debug, and explain Spring AI applications in
> production."

The learning experience should progressively cover the major Spring AI
concepts and features while allowing the learner to run real examples
against a local Spring Boot application.

### Product Principle

> **Learn → See → Code → Run → Inspect → Modify → Verify → Advance**

The website should not merely explain Spring AI. It should make the
learner actively use it.

------------------------------------------------------------------------

# 2. Target User

## Primary Persona

### Java/Spring Boot Developer

Assumptions:

-   Comfortable with Java
-   Comfortable with Spring Boot
-   Understands REST APIs
-   Understands dependency injection
-   Has basic database knowledge
-   May know Maven/Gradle
-   Has little or no practical LLM knowledge
-   Does not know Spring AI APIs
-   Wants practical knowledge rather than AI theory

### Important UX Requirement

Do not assume that the user knows:

-   LLM
-   Token
-   Prompt
-   Embedding
-   Vector
-   Vector Store
-   RAG
-   Tool Calling
-   Agent
-   MCP
-   Context Window
-   Multimodal AI

Introduce these concepts only when necessary and explain them using
Java/Spring analogies.

------------------------------------------------------------------------

# 3. Core Learning Experience

Every major lesson should follow the same structure.

``` text
Problem
   ↓
Why this concept exists
   ↓
Simple explanation
   ↓
Java/Spring analogy
   ↓
Architecture diagram
   ↓
Spring AI API
   ↓
Code example
   ↓
Run locally
   ↓
Inspect request/response
   ↓
Modify the example
   ↓
Exercise
   ↓
Checkpoint
   ↓
Next concept
```

This structure should become the standard lesson template.

------------------------------------------------------------------------

# 4. Proposed Information Architecture

## Top Navigation

``` text
Home
Learn
Lab
Progress
Docs
```

### Home

Purpose:

-   Explain the product
-   Explain the learning journey
-   Show what the user will build
-   Start the course
-   Download the local project

### Learn

Purpose:

-   Complete structured curriculum
-   Follow prerequisites
-   Track progress
-   Complete exercises

### Lab

Purpose:

-   Connect to local Spring Boot application
-   Run examples
-   Test features
-   Inspect requests/responses
-   View logs

### Progress

Purpose:

-   Show completion
-   Show knowledge coverage
-   Show weak areas
-   Show completed labs

### Docs

Purpose:

-   Quick reference
-   API reference
-   Official Spring AI documentation links
-   Provider information
-   Version-specific information

------------------------------------------------------------------------

# 5. Homepage Redesign

## Objective

The homepage should answer three questions immediately:

1.  What is Spring AI Tour?
2.  What will I learn?
3.  How do I start?

## Recommended Hero

``` text
Learn Spring AI
by Building Real Java Applications

From Java/Spring Boot developer
to confident Spring AI developer.

[ Start Learning ]
[ Download Local Lab ]
```

## Hero Supporting Text

Explain that the course provides:

-   Step-by-step lessons
-   Visual explanations
-   Java-oriented examples
-   Hands-on labs
-   Local Spring Boot integration
-   Real Spring AI APIs
-   Complete feature coverage

------------------------------------------------------------------------

# 6. Homepage Learning Journey

Show the complete journey visually.

``` text
Prerequisites
      ↓
Spring AI Fundamentals
      ↓
Models
      ↓
ChatClient
      ↓
Embeddings
      ↓
Vector Stores
      ↓
RAG
      ↓
Advisors & Memory
      ↓
Tool Calling
      ↓
Agents
      ↓
MCP
      ↓
Production
      ↓
Capstone
```

Each stage should be clickable.

------------------------------------------------------------------------

# 7. Homepage Feature Cards

Recommended cards:

-   Chat Applications
-   Model Integration
-   Prompt Engineering
-   Structured Output
-   Embeddings
-   Vector Stores
-   RAG
-   Advisors
-   Memory
-   Tool Calling
-   Agents
-   MCP
-   Observability
-   Evaluation
-   Production Patterns

Each card should contain:

``` text
Feature
1-line explanation
Difficulty
Estimated time
```

Example:

``` text
RAG

Build applications that answer questions
using your own documents.

⭐⭐⭐ Advanced
45 min
```

------------------------------------------------------------------------

# 8. Local Lab CTA

The homepage should prominently explain the local lab.

``` text
Your Local Spring AI Lab

Download the starter project.
Run it locally.
Connect this website to your application.
Experiment with Spring AI features.

[ Download Project ]
[ Setup Guide ]
```

This is one of the main differentiators of the product and should not be
hidden inside documentation.

------------------------------------------------------------------------

# 9. Learning Page Redesign

## Layout

Use a three-part learning workspace.

``` text
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
├──────────────┬──────────────────────────┬───────────────┤
│ Learning     │ Lesson Content           │ Playground    │
│ Sidebar      │                          │ / Lab         │
│              │ Explanation              │               │
│ Progress     │ Diagram                  │ Run           │
│              │ Code                     │ Request       │
│ Curriculum   │ Exercise                 │ Response      │
│              │ Checkpoint               │               │
└──────────────┴──────────────────────────┴───────────────┘
```

------------------------------------------------------------------------

# 10. Persistent Learning Sidebar

The sidebar should communicate progression, not simply navigation.

Example:

``` text
SPRING AI JOURNEY

FOUNDATION
✓ What is AI?
✓ LLM Fundamentals
✓ First AI Call
→ ChatClient
○ Prompt Templates
○ Structured Output

MODELS
○ Chat Models
○ Embeddings
○ Image Models
○ Audio
○ Multimodal

DATA
○ Documents
○ Readers
○ Transformers
○ Text Splitters
○ Vector Stores

RAG
○ RAG Fundamentals
○ Retrieval
○ Advisors
○ Advanced RAG

APPLICATIONS
○ Advisors
○ Memory
○ Tool Calling
○ Agents
○ MCP

PRODUCTION
○ Observability
○ Evaluation
○ Security
○ Performance
```

Use:

-   [x] Completed
-   → Current
-   ○ Not started
-   🔒 Locked by prerequisite

------------------------------------------------------------------------

# 11. Lesson Header

Every lesson should show:

``` text
Chapter 04

ChatClient

⭐ Beginner
⏱ 15 minutes
💻 Hands-on

Prerequisites:
✓ ChatModel
```

This gives the learner context before reading.

------------------------------------------------------------------------

# 12. Standard Lesson Structure

Every lesson should use the same visual sequence.

## 12.1 What You'll Learn

Example:

``` text
After this lesson you will understand:

✓ What ChatClient is
✓ Why ChatClient exists
✓ ChatClient vs ChatModel
✓ How to configure it
✓ How to execute a request
```

## 12.2 Why Does This Exist?

Start with a real developer problem.

Example:

``` text
You already know RestClient.

But how do you communicate with an LLM
without dealing directly with provider-specific APIs?

This is where ChatClient comes in.
```

## 12.3 Java/Spring Analogy

Example:

``` text
RestClient

client.get()
      .uri(...)
      .retrieve()

ChatClient

chatClient.prompt(...)
          .user(...)
          .call()
```

This should become a signature feature of Spring AI Tour.

------------------------------------------------------------------------

# 13. Architecture Diagrams

Every important concept should have a visual explanation.

Example:

``` text
Your Spring Boot Application
            ↓
        ChatClient
            ↓
        ChatModel
            ↓
        LLM Provider
```

For RAG:

``` text
Question
   ↓
Embedding
   ↓
Vector Search
   ↓
Relevant Documents
   ↓
Prompt + Context
   ↓
LLM
   ↓
Answer
```

For Tool Calling:

``` text
User
 ↓
LLM
 ↓
Tool Request
 ↓
Java Method
 ↓
Tool Result
 ↓
LLM
 ↓
Final Answer
```

For MCP:

``` text
AI Application
      ↓
   MCP Client
      ↓
   MCP Server
      ↓
Tools / Resources / Prompts
```

------------------------------------------------------------------------

# 14. Interactive Architecture

Static diagrams should be interactive wherever possible.

Example:

``` text
[ChatClient] → [Advisor] → [ChatModel] → [LLM]
```

Clicking ChatClient:

``` text
ChatClient

High-level fluent API for interacting
with chat models.
```

Clicking Advisor:

``` text
Advisor

Intercepts or modifies the AI interaction.
```

This makes the architecture itself a learning navigation system.

------------------------------------------------------------------------

# 15. Concept → API → Code → Runtime Tabs

Every major feature should provide four views.

``` text
[ Concept ] [ API ] [ Code ] [ Runtime ]
```

## Concept

Explain the idea.

## API

Explain Spring AI abstractions.

## Code

Show the Java implementation.

## Runtime

Show what actually happens when the application runs.

------------------------------------------------------------------------

# 16. Interactive Code Examples

Do not only show code.

Provide:

``` text
[ Copy ]
[ Run ]
```

Example:

``` java
ChatClient chatClient = ...

String response = chatClient
        .prompt()
        .user("Explain dependency injection")
        .call()
        .content();
```

After execution show:

``` text
Request
   ↓
ChatClient
   ↓
ChatModel
   ↓
Provider
   ↓
Response
```

------------------------------------------------------------------------

# 17. Local Lab

## Objective

The Local Lab should allow users to connect the website to their locally
running Spring Boot project.

The lab should become a permanent part of the product.

------------------------------------------------------------------------

# 18. Local Lab Status

Persistent status indicator:

``` text
LOCAL SPRING AI LAB

● Connected

http://localhost:8080

Spring Boot: Running
Java: 21
Spring AI: 2.x
```

Disconnected state:

``` text
○ Local server disconnected

[ Test Connection ]
[ Setup Guide ]
```

------------------------------------------------------------------------

# 19. Setup Wizard

The first-time setup experience should be guided.

``` text
STEP 1
Download project
        ↓
STEP 2
Open project
        ↓
STEP 3
Configure provider
        ↓
STEP 4
Run Spring Boot
        ↓
STEP 5
Connect website
        ↓
STEP 6
Run first lab
```

Do not make the user read a large README before getting started.

------------------------------------------------------------------------

# 20. Setup Doctor

Add an environment checker.

``` text
Checking environment...

✓ Java
✓ Maven / Gradle
✓ Project
✓ Port
✓ Spring Boot
✓ Local API

Model Provider

✓ Ollama
○ OpenAI
○ Gemini

STATUS

Ready to learn.
```

For failures, provide actionable fixes.

Example:

``` text
✗ Port 8080 unavailable

Another application is using port 8080.

[ Show Fix ]
```

------------------------------------------------------------------------

# 21. Local Lab Navigation

Recommended:

``` text
Local Lab

Overview
Chat Playground
RAG Playground
Tool Calling
Agents
MCP
API Inspector
Logs
Settings
```

Only expose features relevant to the learner's current progress where
possible.

------------------------------------------------------------------------

# 22. Chat Playground

Example UI:

``` text
Chat Playground

Model
[ Ollama ▼ ]

Temperature
──────●──────

Prompt
┌──────────────────────────────┐
│ Explain Spring AI            │
└──────────────────────────────┘

[ Send ]

Response
───────────────────────────────
...
```

------------------------------------------------------------------------

# 23. API Inspector

This should be a major feature for backend developers.

Show:

``` text
LOCAL REQUEST

POST /api/chat

{
  "message": "Explain Spring AI"
}
```

Then:

``` text
SPRING AI REQUEST

{
  "messages": [...],
  "model": "...",
  "temperature": 0.7
}
```

Then:

``` text
MODEL RESPONSE

{
  ...
}
```

Use tabs:

``` text
[ Local Request ]
[ Spring AI Request ]
[ Model Response ]
```

This helps developers understand the actual execution flow.

------------------------------------------------------------------------

# 24. Logs View

Provide a simplified runtime view.

``` text
12:32:01 Request received
12:32:01 ChatClient invoked
12:32:01 Advisor chain executed
12:32:02 ChatModel invoked
12:32:03 Model response received
12:32:03 Response returned
```

Advanced users can expand individual events.

------------------------------------------------------------------------

# 25. Code Preview in Local Lab

Show the Java code responsible for the current feature.

Example:

``` java
@RestController
public class ChatController {

    private final ChatClient chatClient;

    @GetMapping("/chat")
    public String chat(String message) {
        return chatClient
                .prompt()
                .user(message)
                .call()
                .content();
    }
}
```

Allow:

``` text
[ Copy ]
[ Open in IDE ]
[ Run ]
```

------------------------------------------------------------------------

# 26. Three Learning Modes

Add three modes.

## Learn

For beginners.

Contains:

-   Concepts
-   Analogies
-   Diagrams
-   Simple explanations

## Build

For hands-on implementation.

Contains:

-   Code
-   Labs
-   Exercises
-   Local execution

## Deep Dive

For experienced developers.

Contains:

-   Internals
-   Architecture
-   Advanced APIs
-   Configuration
-   Performance
-   Production considerations

------------------------------------------------------------------------

# 27. Progressive Disclosure

Avoid overwhelming beginners.

Example:

``` text
ChatClient

Basic
─────
Simple ChatClient usage

Advanced ▾
──────────
Advisors
Options
Tools
Memory

Internals ▾
───────────
Request pipeline
Interceptors
Model abstraction
```

Default to simple explanations.

------------------------------------------------------------------------

# 28. Prerequisite System

Before each lesson:

``` text
Before starting

You should know:

✓ ChatModel
✓ Prompt
○ Embeddings

[ Review Embeddings ]
```

If a prerequisite is missing, allow the user to navigate backward.

Do not hard-block the user unless necessary.

------------------------------------------------------------------------

# 29. Related Concepts

At the end of each lesson:

``` text
You just learned

ChatClient

Related:

→ ChatModel
→ Prompt
→ Advisors
→ Memory
→ Streaming
```

This creates a connected knowledge graph.

------------------------------------------------------------------------

# 30. Search

Search should be learning-oriented.

Instead of only returning documentation pages, return:

``` text
Chat Memory

2 min explanation
Architecture
Java example
Interactive lab
Related concepts
Official documentation
```

Search categories:

-   Concept
-   API
-   Example
-   Lab
-   Troubleshooting
-   Official Docs

------------------------------------------------------------------------

# 31. Checkpoints

At the end of each major concept:

``` text
CHECKPOINT

Can you answer?

1. Why does ChatClient exist?
2. ChatClient vs ChatModel?
3. Where does the model provider fit?
4. What does call() do?

[ Check Answers ]
```

Use active exercises rather than only multiple-choice questions.

------------------------------------------------------------------------

# 32. Interactive Exercises

Support:

## Predict the Output

Show code and ask what happens.

## Fix the Code

Give broken Spring AI code.

## Choose the Architecture

Ask the user to select the correct architecture.

## Modify the Example

Allow changes to prompts/options/tools.

## Explain Why

Ask why a particular Spring AI abstraction is used.

------------------------------------------------------------------------

# 33. Version Management

Spring AI evolves quickly.

The UI should clearly show:

``` text
Spring AI Version

[ 2.0.x ▼ ]

Course version: 2.0.x
```

Each lesson should display:

``` text
Spring AI 2.0.x
Spring Boot 4.x
Java 21+
```

If an example differs by version, show an explicit warning.

------------------------------------------------------------------------

# 34. Provider Strategy

Do not overwhelm beginners with every provider.

Start with one recommended provider.

Example:

``` text
Recommended

● Ollama — Local

Other providers
○ OpenAI
○ Gemini
○ Anthropic
○ Azure
○ Bedrock
```

Later introduce the provider abstraction.

Teaching objective:

``` text
Application
     ↓
Spring AI abstraction
     ↓
Provider
```

The learner should understand that Spring AI is not simply an OpenAI
wrapper.

------------------------------------------------------------------------

# 35. Spring AI Curriculum

The website should map the official Spring AI feature set into a
pedagogical sequence.

## Phase 0 --- AI Basics

-   What is an LLM?
-   Tokens
-   Prompts
-   Context
-   Temperature
-   Embeddings
-   Vector search
-   RAG
-   Tool calling
-   Agents
-   MCP

Keep this section short and practical.

------------------------------------------------------------------------

## Phase 1 --- Spring AI Fundamentals

-   What is Spring AI?
-   Project setup
-   First model call
-   ChatModel
-   ChatClient
-   Prompt
-   Prompt templates
-   Streaming
-   Structured output
-   Model options

------------------------------------------------------------------------

## Phase 2 --- Models

-   Chat models
-   Embedding models
-   Image generation
-   Audio
-   Speech
-   Moderation
-   Multimodal
-   Provider abstraction

------------------------------------------------------------------------

## Phase 3 --- Data

-   Document
-   Document readers
-   Document transformers
-   Text splitters
-   Embeddings
-   VectorStore
-   Similarity search
-   Metadata filtering

------------------------------------------------------------------------

## Phase 4 --- RAG

-   What is RAG?
-   RAG architecture
-   Basic RAG
-   Retrieval
-   Question answering
-   Advisors
-   Advanced RAG
-   Query transformation
-   Retrieval strategies
-   RAG evaluation

------------------------------------------------------------------------

## Phase 5 --- Advisors & Memory

-   Advisors
-   Advisor chain
-   Chat memory
-   Conversation memory
-   VectorStore-backed memory
-   Custom advisors

------------------------------------------------------------------------

## Phase 6 --- Tool Calling

-   Tool calling concept
-   `@Tool`
-   Tool parameters
-   Tool callbacks
-   Tool execution
-   Multiple tools
-   Tool errors
-   Tool calling loop
-   Tools + memory
-   Tools + RAG

------------------------------------------------------------------------

## Phase 7 --- Agents

-   What is an agent?
-   Agent loop
-   Tool-driven agents
-   Planning
-   Multi-step execution
-   Agent safety

------------------------------------------------------------------------

## Phase 8 --- MCP

-   What is MCP?
-   MCP architecture
-   MCP client
-   MCP server
-   MCP tools
-   MCP resources
-   MCP prompts
-   Spring AI MCP integration
-   Build an MCP server
-   Consume an MCP server

------------------------------------------------------------------------

## Phase 9 --- Production

-   Auto configuration
-   Observability
-   Logging
-   Metrics
-   Evaluation
-   Security
-   Cost
-   Performance
-   Error handling
-   Provider switching
-   Production architecture

------------------------------------------------------------------------

# 36. Final Capstone

The course should end with a realistic application.

## Spring AI Support Assistant

Architecture:

``` text
                    User
                      ↓
                  ChatClient
                      ↓
             ┌────────┴────────┐
             ↓                 ↓
            RAG              Tools
             ↓                 ↓
        VectorStore        Java APIs
             ↓                 ↓
             └────────┬────────┘
                      ↓
                    Memory
                      ↓
                     LLM
                      ↓
                   Response
```

Then extend it with:

-   Structured output
-   MCP
-   Observability
-   Evaluation
-   Error handling

The learner should implement the application locally.

------------------------------------------------------------------------

# 37. Final Knowledge Assessment

Do not simply display:

``` text
Congratulations!
```

Instead:

``` text
SPRING AI READINESS

Foundation       100%
Models             90%
RAG               100%
Tools              90%
Agents             80%
MCP                70%
Production         80%

[ Take Final Challenge ]
```

The final challenge should test architecture and implementation.

------------------------------------------------------------------------

# 38. Knowledge Map

Create a visual map of Spring AI.

``` text
                         SPRING AI
                              |
       ┌──────────────────────┼─────────────────────┐
       ↓                      ↓                     ↓
     MODELS               CHATCLIENT              DATA
       |                      |                     |
 Chat/Image/Audio        Advisors              Documents
 Embeddings              Memory                Embeddings
 Multimodal              Tools                 VectorStore
                              |                     |
                              └──────────┬──────────┘
                                         ↓
                                        RAG
                                         |
                         ┌───────────────┼───────────────┐
                         ↓               ↓               ↓
                      Memory           Tools            MCP
                         |               |               |
                         └───────────────┼───────────────┘
                                         ↓
                                      Agents
                                         ↓
                                    Production
```

Every node should be clickable.

------------------------------------------------------------------------

# 39. Content Coverage Matrix

Create a project-management matrix to ensure the website covers the
entire Spring AI reference.

  ------------------------------------------------------------------------------------------
  Feature         Lesson   Explanation   Diagram   Code     Local    Exercise   Checkpoint
                                                            Lab                 
  --------------- -------- ------------- --------- -------- -------- ---------- ------------
  ChatModel       ✓        ✓             ✓         ✓        ✓        ✓          ✓

  ChatClient      ✓        ✓             ✓         ✓        ✓        ✓          ✓

  Prompts         ✓        ✓             ✓         ✓        ✓        ✓          ✓

  Structured      ✓        ✓             ✓         ✓        ✓        ✓          ✓
  Output                                                                        

  Embeddings      ✓        ✓             ✓         ✓        ✓        ✓          ✓

  VectorStore     ✓        ✓             ✓         ✓        ✓        ✓          ✓

  RAG             ✓        ✓             ✓         ✓        ✓        ✓          ✓

  Advisors        ✓        ✓             ✓         ✓        ✓        ✓          ✓

  Memory          ✓        ✓             ✓         ✓        ✓        ✓          ✓

  Tool Calling    ✓        ✓             ✓         ✓        ✓        ✓          ✓

  Agents          ✓        ✓             ✓         ✓        ✓        ✓          ✓

  MCP             ✓        ✓             ✓         ✓        ✓        ✓          ✓

  Observability   ✓        ✓             ✓         ✓        ✓        ✓          ✓

  Evaluation      ✓        ✓             ✓         ✓        ✓        ✓          ✓
  ------------------------------------------------------------------------------------------

This matrix should be maintained throughout development.

------------------------------------------------------------------------

# 40. Recommended Lesson Data Model

Do not hardcode every lesson page individually.

Create a reusable lesson schema.

Example:

``` json
{
  "id": "chat-client",
  "title": "ChatClient",
  "level": "beginner",
  "duration": 15,
  "prerequisites": [
    "chat-model"
  ],
  "sections": [
    "what-you-learn",
    "why",
    "concept",
    "java-analogy",
    "architecture",
    "api",
    "code",
    "runtime",
    "exercise",
    "checkpoint"
  ],
  "labs": [
    "basic-chat",
    "streaming-chat"
  ],
  "related": [
    "advisor",
    "memory"
  ]
}
```

Benefits:

-   Consistent UI
-   Faster content creation
-   Easy navigation
-   Easy progress tracking
-   Easy future versioning
-   Easier coverage auditing

------------------------------------------------------------------------

# 41. Recommended Reusable UI Components

Build the frontend around reusable components.

``` text
LessonHeader
LessonSidebar
ProgressBar
PrerequisiteCard
ConceptCard
JavaAnalogyCard
ArchitectureDiagram
CodeBlock
CodeEditor
RunButton
RequestInspector
ResponseInspector
RuntimeTimeline
ExerciseCard
CheckpointCard
RelatedConcepts
OfficialDocsLink
VersionBadge
LocalServerStatus
SetupDoctor
LabConsole
ProviderSelector
ModelSelector
```

This avoids designing every page from scratch.

------------------------------------------------------------------------

# 42. UI Design Principles

## Principle 1 --- Clarity over decoration

The interface should feel like:

``` text
IDE + Interactive Course
```

rather than:

``` text
Marketing website + documentation
```

## Principle 2 --- One primary action

Each lesson should have one clear next action:

``` text
[ Run Example ]
```

or:

``` text
[ Continue ]
```

## Principle 3 --- Progressive disclosure

Beginner information first.

Advanced information behind expandable sections.

## Principle 4 --- Visual learning

Prefer:

``` text
Diagram + Code + Runtime
```

over:

``` text
Large paragraph + code
```

## Principle 5 --- Always explain why

Before showing an API, explain the problem it solves.

------------------------------------------------------------------------

# 43. Recommended Visual Language

Use a clean developer-oriented design.

### Colors

Use Spring-inspired green as the primary accent.

Supporting colors can distinguish:

-   Foundation
-   Models
-   Data
-   RAG
-   Tools
-   Agents
-   MCP
-   Production

### Typography

Use a highly readable sans-serif font.

Use a monospace font for:

-   Java
-   JSON
-   YAML
-   Logs
-   HTTP requests

### Cards

Use cards sparingly.

Avoid excessive rounded cards that make technical content feel like a
marketing site.

------------------------------------------------------------------------

# 44. Accessibility

The redesign should support:

-   Keyboard navigation
-   Visible focus states
-   High contrast
-   Semantic headings
-   Accessible code blocks
-   Screen-reader-friendly navigation
-   Reduced motion option
-   Responsive layouts

Interactive diagrams must have a text explanation as well.

------------------------------------------------------------------------

# 45. Responsive Strategy

Desktop:

``` text
Sidebar | Lesson | Lab
```

Tablet:

``` text
Sidebar
   ↓
Lesson
   ↓
Lab
```

Mobile:

``` text
Header

Lesson

[ Run Lab ]

Interactive lab opens as
full-screen panel.
```

Do not attempt to force the three-column desktop UI onto mobile.

------------------------------------------------------------------------

# 46. Development Roadmap

## Phase 1 --- UX Foundation

Priority: P0

Implement:

-   New homepage
-   Learning roadmap
-   Learning sidebar
-   Breadcrumbs
-   Lesson template
-   Previous/Next navigation
-   Progress tracking
-   Prerequisites
-   Difficulty
-   Duration

------------------------------------------------------------------------

## Phase 2 --- Local Lab

Priority: P0

Implement:

-   Project download
-   Setup guide
-   Connection test
-   Local server status
-   Setup Doctor
-   Chat playground
-   API inspector
-   Logs

------------------------------------------------------------------------

## Phase 3 --- Interactive Learning

Priority: P0

Implement:

-   Architecture diagrams
-   Code examples
-   Run examples
-   Code editor
-   Request/response visualization
-   Runtime timeline
-   Exercises
-   Checkpoints

------------------------------------------------------------------------

## Phase 4 --- Curriculum

Priority: P0

Implement content in this order:

``` text
Foundation
    ↓
ChatClient
    ↓
Models
    ↓
Embeddings
    ↓
VectorStore
    ↓
RAG
    ↓
Advisors
    ↓
Memory
    ↓
Tool Calling
    ↓
Agents
    ↓
MCP
    ↓
Production
```

------------------------------------------------------------------------

## Phase 5 --- Advanced Features

Priority: P1

Implement:

-   Search
-   Knowledge map
-   Version selector
-   Provider matrix
-   Deep Dive mode
-   Advanced reference
-   Troubleshooting
-   Documentation integration

------------------------------------------------------------------------

## Phase 6 --- Capstone

Priority: P1

Implement:

-   Final project
-   Guided architecture
-   Requirements
-   Local execution
-   Validation
-   Final assessment
-   Completion dashboard

------------------------------------------------------------------------

# 47. Priority Matrix

  Feature                         Impact   Priority
  -------------------------- ----------- ----------
  Learning roadmap             Very High         P0
  Persistent sidebar           Very High         P0
  Local server integration     Very High         P0
  Interactive labs             Very High         P0
  Java analogies               Very High         P0
  Architecture diagrams        Very High         P0
  Progress tracking            Very High         P0
  Request lifecycle            Very High         P0
  Prerequisites                     High         P1
  Code playground                   High         P1
  API inspector                     High         P1
  Checkpoints                       High         P1
  Knowledge map                     High         P1
  Provider matrix                 Medium         P2
  Advanced reference              Medium         P2
  Visual polish                   Medium         P2

------------------------------------------------------------------------

# 48. Success Metrics

The redesign should be evaluated using measurable outcomes.

## Learning Metrics

-   Lesson completion rate
-   Lab completion rate
-   Exercise completion rate
-   Checkpoint success rate
-   Final challenge success rate

## UX Metrics

-   Time from landing page to first successful AI response
-   Setup failure rate
-   Local connection success rate
-   Number of users abandoning setup
-   Time spent per lesson
-   Backtracking frequency

## Product Metrics

-   Number of local lab sessions
-   Number of executed examples
-   Number of completed curriculum sections
-   Number of capstone attempts

------------------------------------------------------------------------

# 49. Definition of Done

The project should not be considered complete merely because every page
exists.

A topic is complete only when it has:

``` text
✓ Concept explanation
✓ Why it exists
✓ Java/Spring analogy
✓ Architecture diagram
✓ Spring AI API explanation
✓ Working Java example
✓ Local execution
✓ Request/response visibility
✓ Hands-on exercise
✓ Checkpoint
✓ Related concepts
✓ Official documentation reference
```

A complete course additionally requires:

``` text
✓ Full curriculum coverage
✓ Progress tracking
✓ Local Lab
✓ Final capstone
✓ Final assessment
✓ Production topics
✓ Version awareness
```

------------------------------------------------------------------------

# 50. Final Product Experience

The ideal user journey is:

``` text
Java Developer
      ↓
Visit Spring AI Tour
      ↓
Understand the roadmap
      ↓
Download local Spring Boot project
      ↓
Run application
      ↓
Connect Local Lab
      ↓
Learn first concept
      ↓
See architecture
      ↓
Understand Java analogy
      ↓
Read Spring AI code
      ↓
Run the code
      ↓
Inspect request/response
      ↓
Modify implementation
      ↓
Complete exercise
      ↓
Pass checkpoint
      ↓
Move to next concept
      ↓
Build increasingly complex systems
      ↓
Complete RAG
      ↓
Complete Tool Calling
      ↓
Complete Agents
      ↓
Complete MCP
      ↓
Learn Production
      ↓
Build Capstone
      ↓
Pass Final Challenge
      ↓
Spring AI Developer
```

------------------------------------------------------------------------

# 51. Most Important Product Decision

The project should be treated as:

> **An interactive Spring AI learning environment powered by a local
> Spring Boot laboratory.**

Not:

> A website that summarizes Spring AI documentation.

The official Spring AI documentation should remain the authoritative
reference, while Spring AI Tour becomes the **guided, visual, hands-on
learning layer**.

The strongest differentiator is the combination of:

``` text
Official Spring AI Concepts
        +
Java/Spring Explanations
        +
Visual Architecture
        +
Real Java Code
        +
Local Spring Boot Runtime
        +
Interactive Labs
        +
Progressive Curriculum
        +
Exercises
        +
Final Capstone
```

That combination can make the project significantly more useful than a
conventional documentation site.
