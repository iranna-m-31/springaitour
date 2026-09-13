/**
 * Spring AI Tour — Lesson Schema
 * Defines the curriculum structure for the guided learning platform
 * Maps to the improvement plan's full curriculum (Phases 0-9 + Capstone)
 */

export interface Prerequisite {
  lessonId: string
  description: string
}

export interface JavaAnalogy {
  springConcept: string
  aiConcept: string
  explanation: string
}

export interface CodeExample {
  title: string
  language: 'java' | 'bash' | 'yaml' | 'json'
  before?: string
  after?: string
  description?: string
}

export interface Checkpoint {
  type: 'multiple-choice' | 'predict-output' | 'fix-code' | 'fill-blank'
  question: string
  options?: string[]
  answer: string | string[]
  explanation: string
}

export interface Lesson {
  id: string
  number: number
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimatedTime: number
  phase: 'prerequisites' | 'fundamentals' | 'models' | 'data' | 'rag' | 'memory' | 'tools' | 'agents' | 'mcp' | 'production' | 'capstone'
  objectives: string[]
  prerequisites: Prerequisite[]
  mdxFiles: {
    concept: string
    visual: string
    code: string
    interactive: string
  }
  analogies: JavaAnalogy[]
  interactive: {
    showSplitPane?: boolean
    showArchitectureDiagram?: boolean
    showCodeDiff?: boolean
    showApiInspector?: boolean
    showCheckpoint?: boolean
  }
  relatedLessons: string[]
  resources: Array<{
    title: string
    url: string
    type: 'documentation' | 'video' | 'article' | 'reference'
  }>
  masteryCriteria: {
    mustCompleteCheckpoint: boolean
    maxAttemptsAllowed: number
  }
  /** For features that map to an existing feature in features.ts */
  featureId?: string
}

export const lessons: Lesson[] = [
  // ═══════════════════════════════════════════════════════════════
  // PHASE 0 — AI Basics
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'what-is-llm',
    number: 1,
    title: 'What is an LLM?',
    difficulty: 'beginner',
    estimatedTime: 8,
    phase: 'prerequisites',
    objectives: [
      'Understand what large language models are',
      'Differentiate between LLMs and traditional search',
      'Understand the concept of probability in text generation'
    ],
    prerequisites: [],
    mdxFiles: {
      concept: 'concepts/01-llm-concept.mdx',
      visual: 'concepts/01-llm-visual.mdx',
      code: 'concepts/01-llm-code.mdx',
      interactive: 'concepts/01-llm-interactive.mdx'
    },
    analogies: [
      {
        springConcept: 'JPA @Entity with auto-generated ID',
        aiConcept: 'LLM generating next word/token',
        explanation: 'Just as JPA predicts the next ID based on entity state, an LLM predicts the next token based on the probability distribution over its vocabulary.'
      },
      {
        springConcept: 'Database query optimizer',
        aiConcept: 'LLM decoding strategy',
        explanation: 'Like a database optimizer chooses execution plans, an LLM uses sampling strategies (temperature, top-k, top-p) to choose the next token.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['tokens-temperature', 'what-is-spring-ai'],
    resources: [
      { title: 'What are LLMs?', url: 'https://docs.spring.io/spring-ai/reference/index.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'plain-chat'
  },
  {
    id: 'tokens-temperature',
    number: 2,
    title: 'Tokens, Context Window & Temperature',
    difficulty: 'beginner',
    estimatedTime: 10,
    phase: 'prerequisites',
    objectives: [
      'Understand what tokens are and how they are counted',
      'Understand the context window and its implications',
      'Understand how temperature affects output'
    ],
    prerequisites: [{ lessonId: 'what-is-llm', description: 'Basic understanding of what an LLM is' }],
    mdxFiles: {
      concept: 'concepts/02-tokens-temperature.mdx',
      visual: 'concepts/02-tokens-temperature.mdx',
      code: 'concepts/02-tokens-temperature.mdx',
      interactive: 'concepts/02-tokens-temperature.mdx'
    },
    analogies: [
      {
        springConcept: 'String chunking / buffer size',
        aiConcept: 'Tokenization and context window',
        explanation: 'Just as a buffer has a fixed size that limits how much data you can process, the context window limits how many tokens the model can consider at once.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['what-is-llm', 'embeddings-basics', 'prompt-engineering'],
    resources: [
      { title: 'Context Window Guide', url: 'https://platform.openai.com/docs/guides/large-context-window', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'embeddings-basics',
    number: 3,
    title: 'Embeddings & Vector Search Basics',
    difficulty: 'beginner',
    estimatedTime: 12,
    phase: 'prerequisites',
    objectives: [
      'Understand what an embedding is',
      'Understand cosine similarity',
      'Understand how vector search works'
    ],
    prerequisites: [{ lessonId: 'tokens-temperature', description: 'Understand tokens and context' }],
    mdxFiles: {
      concept: 'concepts/03-embeddings-basics.mdx',
      visual: 'concepts/03-embeddings-basics.mdx',
      code: 'concepts/03-embeddings-basics.mdx',
      interactive: 'concepts/03-embeddings-basics.mdx'
    },
    analogies: [
      {
        springConcept: 'HashMap lookup / indexing',
        aiConcept: 'Vector similarity search',
        explanation: 'Just as a HashMap indexes data for fast lookup, a vector store indexes embeddings for fast similarity search based on distance metrics.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['tokens-temperature', 'vector-store-fundamentals'],
    resources: [
      { title: 'Embeddings Guide', url: 'https://docs.spring.io/spring-ai/reference/api/embedding.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'embeddings'
  },
  {
    id: 'prompt-engineering',
    number: 4,
    title: 'Prompt Engineering Fundamentals',
    difficulty: 'beginner',
    estimatedTime: 10,
    phase: 'prerequisites',
    objectives: [
      'Understand what a prompt is',
      'Learn effective prompt design techniques',
      'Understand system prompts vs user prompts'
    ],
    prerequisites: [{ lessonId: 'what-is-llm', description: 'Basic understanding of LLMs' }],
    mdxFiles: {
      concept: 'concepts/04-prompt-engineering.mdx',
      visual: 'concepts/04-prompt-engineering.mdx',
      code: 'concepts/04-prompt-engineering.mdx',
      interactive: 'concepts/04-prompt-engineering.mdx'
    },
    analogies: [
      {
        springConcept: 'Method signature / API contract',
        aiConcept: 'Prompt as an API contract with the LLM',
        explanation: 'Just as a method signature defines what you expect from a function, a prompt defines what you expect from the LLM. A well-designed prompt gets better results.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['system-prompts', 'prompt-templates', 'structured-output'],
    resources: [
      { title: 'Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'rag-fundamentals',
    number: 5,
    title: 'RAG Fundamentals',
    difficulty: 'intermediate',
    estimatedTime: 15,
    phase: 'prerequisites',
    objectives: [
      'Understand what RAG is and why it matters',
      'Understand the RAG architecture',
      'Learn when to use RAG vs just prompting'
    ],
    prerequisites: [
      { lessonId: 'embeddings-basics', description: 'Understand embeddings and vectors' },
      { lessonId: 'prompt-engineering', description: 'Understand prompt design' }
    ],
    mdxFiles: {
      concept: 'concepts/05-rag-fundamentals.mdx',
      visual: 'concepts/05-rag-fundamentals.mdx',
      code: 'concepts/05-rag-fundamentals.mdx',
      interactive: 'concepts/05-rag-fundamentals.mdx'
    },
    analogies: [
      {
        springConcept: 'JPA Repository with custom query',
        aiConcept: 'RAG with VectorStore',
        explanation: 'Just as JPA Repository retrieves data from a database, RAG retrieves relevant context from a vector store to augment the LLM prompt.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['vector-store-fundamentals', 'rag-advanced', 'chat-client'],
    resources: [
      { title: 'RAG Guide', url: 'https://docs.spring.io/spring-ai/reference/api/retrieval.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'rag'
  },
  {
    id: 'tool-calling-concept',
    number: 6,
    title: 'Tool Calling Concept',
    difficulty: 'intermediate',
    estimatedTime: 12,
    phase: 'prerequisites',
    objectives: [
      'Understand what tool calling is',
      'Learn why LLMs need tools',
      'Understand the tool calling loop'
    ],
    prerequisites: [{ lessonId: 'what-is-llm', description: 'Basic understanding of LLMs' }],
    mdxFiles: {
      concept: 'concepts/06-tool-calling-concept.mdx',
      visual: 'concepts/06-tool-calling-concept.mdx',
      code: 'concepts/06-tool-calling-concept.mdx',
      interactive: 'concepts/06-tool-calling-concept.mdx'
    },
    analogies: [
      {
        springConcept: 'SpEL / MethodInvoker',
        aiConcept: 'Tool calling as dynamic method invocation',
        explanation: 'Just as Spring Expression Language can dynamically invoke methods, tool calling lets the LLM dynamically decide which Java method to invoke.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['tool-calling-implementation', 'agents-fundamentals'],
    resources: [
      { title: 'Tool Calling Guide', url: 'https://docs.spring.io/spring-ai/reference/api/tool-calling.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'tool-calling'
  },
  {
    id: 'agents-concept',
    number: 7,
    title: 'Agents Concept',
    difficulty: 'intermediate',
    estimatedTime: 12,
    phase: 'prerequisites',
    objectives: [
      'Understand what an AI agent is',
      'Learn the agent loop',
      'Understand when agents differ from simple tool calling'
    ],
    prerequisites: [{ lessonId: 'tool-calling-concept', description: 'Understand tool calling basics' }],
    mdxFiles: {
      concept: 'concepts/07-agents-concept.mdx',
      visual: 'concepts/07-agents-concept.mdx',
      code: 'concepts/07-agents-concept.mdx',
      interactive: 'concepts/07-agents-concept.mdx'
    },
    analogies: [
      {
        springConcept: 'State Machine / Workflow',
        aiConcept: 'Agent as a state machine',
        explanation: 'Just as a Spring State Machine transitions between states based on events, an agent loops through states: think, act, observe, repeat.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['tool-calling-concept', 'mcp-concept'],
    resources: [
      { title: 'Agents Guide', url: 'https://docs.spring.io/spring-ai/reference/api/agent.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'mcp-concept',
    number: 8,
    title: 'MCP Concept',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'prerequisites',
    objectives: [
      'Understand what MCP is',
      'Learn why MCP matters as a standard',
      'Understand MCP architecture'
    ],
    prerequisites: [{ lessonId: 'tool-calling-concept', description: 'Understand tool calling basics' }],
    mdxFiles: {
      concept: 'concepts/08-mcp-concept.mdx',
      visual: 'concepts/08-mcp-concept.mdx',
      code: 'concepts/08-mcp-concept.mdx',
      interactive: 'concepts/08-mcp-concept.mdx'
    },
    analogies: [
      {
        springConcept: 'JDBC / SPI',
        aiConcept: 'MCP as a standard interface for tools',
        explanation: 'Just as JDBC provides a standard interface for databases, MCP provides a standard interface for AI tools, making any MCP server usable by any MCP client.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['agents-concept', 'tool-calling-concept'],
    resources: [
      { title: 'MCP Official Site', url: 'https://modelcontextprotocol.io', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'mcp'
  },
  {
    id: 'moderation-basic',
    number: 9,
    title: 'Moderation & Safety',
    difficulty: 'beginner',
    estimatedTime: 8,
    phase: 'prerequisites',
    objectives: [
      'Understand content moderation',
      'Learn how moderation models work',
      'Understand why safety matters in production'
    ],
    prerequisites: [{ lessonId: 'what-is-llm', description: 'Basic understanding of LLMs' }],
    mdxFiles: {
      concept: 'concepts/09-moderation.mdx',
      visual: 'concepts/09-moderation.mdx',
      code: 'concepts/09-moderation.mdx',
      interactive: 'concepts/09-moderation.mdx'
    },
    analogies: [
      {
        springConcept: 'Spring Security / FilterChain',
        aiConcept: 'Moderation as a security filter',
        explanation: 'Just as Spring Security filters intercept requests for security checks, moderation models intercept prompts and responses to check for unsafe content.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['advisors-concept', 'what-is-spring-ai'],
    resources: [
      { title: 'Moderation Guide', url: 'https://docs.spring.io/spring-ai/reference/api/moderation.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1 — Spring AI Fundamentals
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'first-ai-call',
    number: 10,
    title: 'First AI Call',
    difficulty: 'beginner',
    estimatedTime: 10,
    phase: 'fundamentals',
    objectives: [
      'Set up your first Spring AI project',
      'Make your first LLM call',
      'Understand the ChatModel abstraction'
    ],
    prerequisites: [],
    mdxFiles: {
      concept: 'concepts/10-first-ai-call.mdx',
      visual: 'concepts/10-first-ai-call.mdx',
      code: 'concepts/10-first-ai-call.mdx',
      interactive: 'concepts/10-first-ai-call.mdx'
    },
    analogies: [
      {
        springConcept: 'RestTemplate.getForObject()',
        aiConcept: 'ChatModel.call()',
        explanation: 'Just as RestTemplate.getForObject() makes an HTTP call and returns a response, ChatModel.call() makes an AI call and returns a generated response.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['chat-model', 'chat-client'],
    resources: [
      { title: 'Getting Started', url: 'https://docs.spring.io/spring-ai/reference/getting-started.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'chat-model',
    number: 11,
    title: 'ChatModel',
    difficulty: 'beginner',
    estimatedTime: 15,
    phase: 'fundamentals',
    objectives: [
      'Understand the ChatModel interface',
      'Learn how to configure ChatModel beans',
      'Understand model providers and abstractions',
      'Differentiate ChatModel vs ChatClient'
    ],
    prerequisites: [{ lessonId: 'first-ai-call', description: 'Make your first AI call' }],
    mdxFiles: {
      concept: 'concepts/11-chat-model.mdx',
      visual: 'concepts/11-chat-model.mdx',
      code: 'concepts/11-chat-model.mdx',
      interactive: 'concepts/11-chat-model.mdx'
    },
    analogies: [
      {
        springConcept: 'PlatformTransactionManager',
        aiConcept: 'ChatModel as the core transaction manager',
        explanation: 'Just as PlatformTransactionManager abstracts transaction handling across databases, ChatModel abstracts LLM interactions across providers.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['first-ai-call', 'chat-client', 'streaming'],
    resources: [
      { title: 'ChatModel API', url: 'https://docs.spring.io/spring-ai/reference/api/chatmodel.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'chat-client',
    number: 12,
    title: 'ChatClient',
    difficulty: 'beginner',
    estimatedTime: 25,
    phase: 'fundamentals',
    objectives: [
      'Understand the role of ChatClient in Spring AI',
      'Differentiate ChatModel vs ChatClient',
      'Build prompts using the fluent API',
      'Execute synchronous and streaming calls',
      'Handle responses and metadata'
    ],
    prerequisites: [{ lessonId: 'first-ai-call', description: 'Make your first AI call' }, { lessonId: 'chat-model', description: 'Understand ChatModel' }],
    mdxFiles: {
      concept: 'concepts/12-chat-client.mdx',
      visual: 'concepts/12-chat-client.mdx',
      code: 'concepts/12-chat-client.mdx',
      interactive: 'concepts/12-chat-client.mdx'
    },
    analogies: [
      {
        springConcept: 'RestClient / WebClient',
        aiConcept: 'ChatClient',
        explanation: 'Just as RestClient provides a fluent API for HTTP calls, ChatClient provides a fluent API for LLM interactions.'
      },
      {
        springConcept: '@Service with @Autowired dependencies',
        aiConcept: 'ChatClient configured with ChatModel advisor',
        explanation: 'A ChatClient is a service-oriented facade that manages the LLM interaction flow, similar to how @Service orchestrates business logic.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: true, showApiInspector: true, showCheckpoint: true },
    relatedLessons: ['chat-model', 'prompt-templates', 'streaming', 'structured-output', 'advisors-concept'],
    resources: [
      { title: 'ChatClient API', url: 'https://docs.spring.io/spring-ai/reference/api/chatclient.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'plain-chat'
  },
  {
    id: 'system-prompts',
    number: 13,
    title: 'System Prompts',
    difficulty: 'beginner',
    estimatedTime: 12,
    phase: 'fundamentals',
    objectives: [
      'Create reusable ChatClient personas with default system instructions',
      'Understand ChatClient immutability',
      'Configure multiple ChatClient beans'
    ],
    prerequisites: [{ lessonId: 'chat-client', description: 'Understand ChatClient basics' }],
    mdxFiles: {
      concept: 'concepts/13-system-prompts.mdx',
      visual: 'concepts/13-system-prompts.mdx',
      code: 'concepts/13-system-prompts.mdx',
      interactive: 'concepts/13-system-prompts.mdx'
    },
    analogies: [
      {
        springConcept: 'InitializingBean / @PostConstruct',
        aiConcept: 'defaultSystem in ChatClient builder',
        explanation: 'Just as @PostConstruct sets up a bean once before use, defaultSystem configures the ChatClient once during building and applies to every call.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['chat-client', 'prompt-templates', 'advisors-concept'],
    resources: [
      { title: 'System Prompt Guide', url: 'https://docs.spring.io/spring-ai/reference/api/chatclient.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'prompt-templates',
    number: 14,
    title: 'Prompt Templates',
    difficulty: 'beginner',
    estimatedTime: 12,
    phase: 'fundamentals',
    objectives: [
      'Separate prompt structure from runtime values',
      'Use StringTemplate placeholders',
      'Build reusable prompt templates'
    ],
    prerequisites: [{ lessonId: 'chat-client', description: 'Understand ChatClient basics' }],
    mdxFiles: {
      concept: 'concepts/14-prompt-templates.mdx',
      visual: 'concepts/14-prompt-templates.mdx',
      code: 'concepts/14-prompt-templates.mdx',
      interactive: 'concepts/14-prompt-templates.mdx'
    },
    analogies: [
      {
        springConcept: 'Thymeleaf / FreeMarker templates',
        aiConcept: 'StringTemplate prompt templates',
        explanation: 'Just as Thymeleaf templates separate HTML structure from data, StringTemplate separates prompt structure from runtime values using {placeholder} syntax.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['system-prompts', 'chat-client', 'structured-output'],
    resources: [
      { title: 'Prompt Templates Guide', url: 'https://docs.spring.io/spring-ai/reference/api/prompt.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'streaming',
    number: 15,
    title: 'Streaming Responses',
    difficulty: 'beginner',
    estimatedTime: 15,
    phase: 'fundamentals',
    objectives: [
      'Stream tokens in real-time using WebFlux Flux',
      'Understand why streaming improves UX',
      'Handle streaming responses in a Spring Boot app'
    ],
    prerequisites: [{ lessonId: 'chat-client', description: 'Understand ChatClient basics' }],
    mdxFiles: {
      concept: 'concepts/15-streaming.mdx',
      visual: 'concepts/15-streaming.mdx',
      code: 'concepts/15-streaming.mdx',
      interactive: 'concepts/15-streaming.mdx'
    },
    analogies: [
      {
        springConcept: 'StreamingResponseBody / SseEmitter',
        aiConcept: 'ChatClient.stream() returning Flux<String>',
        explanation: 'Just as StreamingResponseBody streams HTTP responses chunk by chunk, ChatClient.stream() returns a Flux that emits LLM tokens as they are generated.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['chat-client', 'structured-output', 'chat-model'],
    resources: [
      { title: 'Streaming Guide', url: 'https://docs.spring.io/spring-ai/reference/api/chatclient.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'streaming'
  },
  {
    id: 'structured-output',
    number: 16,
    title: 'Structured Output → POJO',
    difficulty: 'intermediate',
    estimatedTime: 15,
    phase: 'fundamentals',
    objectives: [
      'Map LLM output directly to Java records',
      'Use .entity(Class) and ParameterizedTypeReference',
      'Understand reliability switches (validateSchema, useProviderStructuredOutput)'
    ],
    prerequisites: [{ lessonId: 'chat-client', description: 'Understand ChatClient basics' }],
    mdxFiles: {
      concept: 'concepts/16-structured-output.mdx',
      visual: 'concepts/16-structured-output.mdx',
      code: 'concepts/16-structured-output.mdx',
      interactive: 'concepts/16-structured-output.mdx'
    },
    analogies: [
      {
        springConcept: 'HttpMessageConverter / Jackson',
        aiConcept: 'Structured output mapping',
        explanation: 'Just as Jackson converts JSON to Java objects, Spring AI converts LLM responses directly to Java records — no manual JSON parsing needed.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['chat-client', 'prompt-templates', 'chat-model'],
    resources: [
      { title: 'Structured Output Guide', url: 'https://docs.spring.io/spring-ai/reference/api/structured-output.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'model-options',
    number: 17,
    title: 'Model Options & Configuration',
    difficulty: 'intermediate',
    estimatedTime: 12,
    phase: 'fundamentals',
    objectives: [
      'Configure model options (temperature, top-k, top-p)',
      'Understand request options per call',
      'Override default options dynamically'
    ],
    prerequisites: [{ lessonId: 'chat-client', description: 'Understand ChatClient basics' }],
    mdxFiles: {
      concept: 'concepts/17-model-options.mdx',
      visual: 'concepts/17-model-options.mdx',
      code: 'concepts/17-model-options.mdx',
      interactive: 'concepts/17-model-options.mdx'
    },
    analogies: [
      {
        springConcept: 'JpaRepository custom queries',
        aiConcept: 'Request-specific model options',
        explanation: 'Just as you can add custom query hints to JPA queries, you can override model options per request while keeping defaults configured globally.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['chat-client', 'chat-model', 'streaming'],
    resources: [
      { title: 'Model Options Guide', url: 'https://docs.spring.io/spring-ai/reference/api/chatclient.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2 — Models
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'chat-models-deep',
    number: 18,
    title: 'Chat Models Deep Dive',
    difficulty: 'intermediate',
    estimatedTime: 20,
    phase: 'models',
    objectives: [
      'Understand different chat model families',
      'Compare model capabilities',
      'Configure and switch between providers',
      'Understand provider abstraction'
    ],
    prerequisites: [{ lessonId: 'chat-model', description: 'Understand ChatModel basics' }],
    mdxFiles: {
      concept: 'concepts/18-chat-models-deep.mdx',
      visual: 'concepts/18-chat-models-deep.mdx',
      code: 'concepts/18-chat-models-deep.mdx',
      interactive: 'concepts/18-chat-models-deep.mdx'
    },
    analogies: [
      {
        springConcept: 'DataSource abstraction / JDBC driver',
        aiConcept: 'ChatModel abstraction / Provider driver',
        explanation: 'Just as Spring\'s DataSource abstraction lets you switch databases by changing the driver, ChatModel abstraction lets you switch LLM providers by changing the configuration.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['chat-model', 'embedding-models', 'multimodal', 'provider-strategy'],
    resources: [
      { title: 'Provider Comparison', url: 'https://docs.spring.io/spring-ai/reference/index.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'embedding-models',
    number: 19,
    title: 'Embedding Models',
    difficulty: 'intermediate',
    estimatedTime: 15,
    phase: 'models',
    objectives: [
      'Understand embedding model types',
      'Configure embedding models',
      'Use embeddings for semantic search',
      'Compare embedding providers'
    ],
    prerequisites: [
      { lessonId: 'embeddings-basics', description: 'Understand embeddings basics' },
      { lessonId: 'chat-models-deep', description: 'Understand ChatModel patterns' }
    ],
    mdxFiles: {
      concept: 'concepts/19-embedding-models.mdx',
      visual: 'concepts/19-embedding-models.mdx',
      code: 'concepts/19-embedding-models.mdx',
      interactive: 'concepts/19-embedding-models.mdx'
    },
    analogies: [
      {
        springConcept: 'MessageConverter',
        aiConcept: 'EmbeddingModel converts text to vectors',
        explanation: 'Just as HttpMessageConverter converts between Java objects and HTTP messages, EmbeddingModel converts text into vector representations.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['chat-models-deep', 'vector-store-fundamentals', 'rag-advanced'],
    resources: [
      { title: 'Embedding Models Guide', url: 'https://docs.spring.io/spring-ai/reference/api/embedding.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'embeddings'
  },
  {
    id: 'multimodal',
    number: 20,
    title: 'Multimodal AI (Image, Audio)',
    difficulty: 'advanced',
    estimatedTime: 18,
    phase: 'models',
    objectives: [
      'Understand multimodal models',
      'Send images and text to vision models',
      'Work with audio and speech models',
      'Handle moderation models'
    ],
    prerequisites: [
      { lessonId: 'chat-models-deep', description: 'Understand ChatModel patterns' },
      { lessonId: 'moderation-basic', description: 'Understand moderation basics' }
    ],
    mdxFiles: {
      concept: 'concepts/20-multimodal.mdx',
      visual: 'concepts/20-multimodal.mdx',
      code: 'concepts/20-multimodal.mdx',
      interactive: 'concepts/20-multimodal.mdx'
    },
    analogies: [
      {
        springConcept: 'MultipartFile / ContentNegotiation',
        aiConcept: 'Multimodal input types',
        explanation: 'Just as MultipartFile handles file uploads alongside form data, Multimodal models handle images alongside text as different input types.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['chat-models-deep', 'embedding-models', 'moderation-basic'],
    resources: [
      { title: 'Multimodal Guide', url: 'https://docs.spring.io/spring-ai/reference/model/multimodal.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'provider-strategy',
    number: 21,
    title: 'Provider Strategy',
    difficulty: 'intermediate',
    estimatedTime: 12,
    phase: 'models',
    objectives: [
      'Understand the provider abstraction',
      'Start with one recommended provider',
      'Learn how to switch providers',
      'Understand the teaching objective: Application → Spring AI → Provider'
    ],
    prerequisites: [{ lessonId: 'chat-model', description: 'Understand ChatModel abstraction' }],
    mdxFiles: {
      concept: 'concepts/21-provider-strategy.mdx',
      visual: 'concepts/21-provider-strategy.mdx',
      code: 'concepts/21-provider-strategy.mdx',
      interactive: 'concepts/21-provider-strategy.mdx'
    },
    analogies: [
      {
        springConcept: 'Strategy Pattern / SPI',
        aiConcept: 'Provider strategy pattern',
        explanation: 'Just as Spring\'s Strategy Pattern lets you swap implementations, the provider abstraction lets you swap LLM providers without changing application code.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['chat-models-deep', 'chat-model', 'advisors-concept'],
    resources: [
      { title: 'Provider Guide', url: 'https://docs.spring.io/spring-ai/reference/index.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3 — Data
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'document-readers',
    number: 22,
    title: 'Document Readers',
    difficulty: 'intermediate',
    estimatedTime: 15,
    phase: 'data',
    objectives: [
      'Understand Document abstraction',
      'Use DocumentReader implementations',
      'Load documents from various sources'
    ],
    prerequisites: [
      { lessonId: 'embeddings-basics', description: 'Understand embeddings' },
      { lessonId: 'rag-fundamentals', description: 'Understand RAG basics' }
    ],
    mdxFiles: {
      concept: 'concepts/22-document-readers.mdx',
      visual: 'concepts/22-document-readers.mdx',
      code: 'concepts/22-document-readers.mdx',
      interactive: 'concepts/22-document-readers.mdx'
    },
    analogies: [
      {
        springConcept: 'ResourceLoader / Resource',
        aiConcept: 'DocumentReader loads documents',
        explanation: 'Just as ResourceLoader abstracts loading resources from various sources (classpath, file system, URL), DocumentReader abstracts loading documents from various formats.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['document-transformers', 'vector-store-fundamentals', 'text-splitters'],
    resources: [
      { title: 'Document Readers Guide', url: 'https://docs.spring.io/spring-ai/reference/api/document-reader.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'text-splitters',
    number: 23,
    title: 'Text Splitters',
    difficulty: 'intermediate',
    estimatedTime: 12,
    phase: 'data',
    objectives: [
      'Understand why text needs splitting',
      'Use TokenTextSplitter and others',
      'Configure chunk size and overlap'
    ],
    prerequisites: [{ lessonId: 'document-readers', description: 'Understand Document abstraction' }],
    mdxFiles: {
      concept: 'concepts/23-text-splitters.mdx',
      visual: 'concepts/23-text-splitters.mdx',
      code: 'concepts/23-text-splitters.mdx',
      interactive: 'concepts/23-text-splitters.mdx'
    },
    analogies: [
      {
        springConcept: 'StringTokenizer / BufferedReader',
        aiConcept: 'TokenTextSplitter chunks text',
        explanation: 'Just as BufferedReader reads text in chunks, TokenTextSplitter breaks documents into manageable chunks that fit within the model\'s context window.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['document-readers', 'vector-store-fundamentals', 'rag-advanced'],
    resources: [
      { title: 'Text Splitters Guide', url: 'https://docs.spring.io/spring-ai/reference/api/document-transformer.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'document-transformers',
    number: 24,
    title: 'Document Transformers',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'data',
    objectives: [
      'Apply transformations to documents',
      'Use DocumentTransformer implementations',
      'Create custom transformers'
    ],
    prerequisites: [{ lessonId: 'document-readers', description: 'Understand Document abstraction' }],
    mdxFiles: {
      concept: 'concepts/24-document-transformers.mdx',
      visual: 'concepts/24-document-transformers.mdx',
      code: 'concepts/24-document-transformers.mdx',
      interactive: 'concepts/24-document-transformers.mdx'
    },
    analogies: [
      {
        springConcept: 'BeanPostProcessor',
        aiConcept: 'DocumentTransformer processes documents',
        explanation: 'Just as BeanPostProcessor modifies beans after initialization, DocumentTransformer modifies documents after loading to clean and enrich them.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['document-readers', 'text-splitters', 'vector-store-fundamentals'],
    resources: [
      { title: 'Document Transformers Guide', url: 'https://docs.spring.io/spring-ai/reference/api/document-transformer.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'vector-store-fundamentals',
    number: 25,
    title: 'Vector Store Fundamentals',
    difficulty: 'intermediate',
    estimatedTime: 15,
    phase: 'data',
    objectives: [
      'Understand VectorStore interface',
      'Use SimpleVectorStore for demos',
      'Configure Qdrant or PGVector for production',
      'Understand similarity search and metadata filtering'
    ],
    prerequisites: [
      { lessonId: 'embeddings-basics', description: 'Understand embeddings' },
      { lessonId: 'text-splitters', description: 'Understand text splitting' }
    ],
    mdxFiles: {
      concept: 'concepts/25-vector-store-fundamentals.mdx',
      visual: 'concepts/25-vector-store-fundamentals.mdx',
      code: 'concepts/25-vector-store-fundamentals.mdx',
      interactive: 'concepts/25-vector-store-fundamentals.mdx'
    },
    analogies: [
      {
        springConcept: 'JpaRepository / Neo4jRepository',
        aiConcept: 'VectorStore for vector operations',
        explanation: 'Just as JpaRepository provides CRUD and query operations for relational data, VectorStore provides CRUD and similarity operations for vector data.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['embedding-models', 'document-readers', 'rag-advanced', 'rag-fundamentals'],
    resources: [
      { title: 'Vector Store Guide', url: 'https://docs.spring.io/spring-ai/reference/api/vector-store.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'rag'
  },
  {
    id: 'metadata-filtering',
    number: 26,
    title: 'Metadata Filtering',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'data',
    objectives: [
      'Understand metadata in vector stores',
      'Filter by metadata during search',
      'Use metadata for document organization'
    ],
    prerequisites: [{ lessonId: 'vector-store-fundamentals', description: 'Understand VectorStore basics' }],
    mdxFiles: {
      concept: 'concepts/26-metadata-filtering.mdx',
      visual: 'concepts/26-metadata-filtering.mdx',
      code: 'concepts/26-metadata-filtering.mdx',
      interactive: 'concepts/26-metadata-filtering.mdx'
    },
    analogies: [
      {
        springConcept: 'Specification Pattern / QueryDSL',
        aiConcept: 'Metadata filtering as query specification',
        explanation: 'Just as the Specification Pattern builds dynamic queries, metadata filtering builds dynamic vector searches based on document properties.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['vector-store-fundamentals', 'rag-advanced', 'document-readers'],
    resources: [
      { title: 'Metadata Filtering Guide', url: 'https://docs.spring.io/spring-ai/reference/api/vector-store.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4 — RAG
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'rag-implementation',
    number: 27,
    title: 'RAG Implementation',
    difficulty: 'intermediate',
    estimatedTime: 20,
    phase: 'rag',
    objectives: [
      'Build a complete RAG pipeline',
      'Configure DocumentReader → Splitter → VectorStore → ChatClient',
      'Understand RAG architecture end-to-end'
    ],
    prerequisites: [
      { lessonId: 'rag-fundamentals', description: 'Understand RAG basics' },
      { lessonId: 'vector-store-fundamentals', description: 'Understand VectorStore' },
      { lessonId: 'chat-client', description: 'Understand ChatClient' }
    ],
    mdxFiles: {
      concept: 'concepts/27-rag-implementation.mdx',
      visual: 'concepts/27-rag-implementation.mdx',
      code: 'concepts/27-rag-implementation.mdx',
      interactive: 'concepts/27-rag-implementation.mdx'
    },
    analogies: [
      {
        springConcept: 'Spring Batch / Integration Flow',
        aiConcept: 'RAG pipeline',
        explanation: 'Just as Spring Batch defines a job flow (read → process → write), RAG defines a pipeline (retrieve → augment → generate).'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: true, showApiInspector: true, showCheckpoint: true },
    relatedLessons: ['rag-fundamentals', 'retrieval-strategies', 'rag-advanced'],
    resources: [
      { title: 'RAG Implementation Guide', url: 'https://docs.spring.io/spring-ai/reference/api/retrieval.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'rag'
  },
  {
    id: 'retrieval-strategies',
    number: 28,
    title: 'Retrieval Strategies',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'rag',
    objectives: [
      'Understand different retrieval strategies',
      'Implement hybrid search',
      'Compare retrieval approaches'
    ],
    prerequisites: [{ lessonId: 'rag-implementation', description: 'Build a RAG pipeline' }],
    mdxFiles: {
      concept: 'concepts/28-retrieval-strategies.mdx',
      visual: 'concepts/28-retrieval-strategies.mdx',
      code: 'concepts/28-retrieval-strategies.mdx',
      interactive: 'concepts/28-retrieval-strategies.mdx'
    },
    analogies: [
      {
        springConcept: 'QueryStrategy / Strategy Pattern',
        aiConcept: 'Retrieval strategies for different queries',
        explanation: 'Just as Strategy Pattern lets you swap algorithms, retrieval strategies let you swap how documents are fetched based on query type.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['rag-implementation', 'rag-advanced', 'query-transformation'],
    resources: [
      { title: 'Retrieval Strategies Guide', url: 'https://docs.spring.io/spring-ai/reference/api/retrieval.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'rag-advanced',
    number: 29,
    title: 'Advanced RAG',
    difficulty: 'advanced',
    estimatedTime: 20,
    phase: 'rag',
    objectives: [
      'Implement query transformation',
      'Use multi-step retrieval',
      'Understand RAG evaluation',
      'Optimize RAG performance'
    ],
    prerequisites: [{ lessonId: 'rag-implementation', description: 'Build a complete RAG pipeline' }],
    mdxFiles: {
      concept: 'concepts/29-rag-advanced.mdx',
      visual: 'concepts/29-rag-advanced.mdx',
      code: 'concepts/29-rag-advanced.mdx',
      interactive: 'concepts/29-rag-advanced.mdx'
    },
    analogies: [
      {
        springConcept: 'Caching / Optimization patterns',
        aiConcept: 'RAG optimization',
        explanation: 'Just as caching layers optimize database queries, RAG optimization techniques (query transformation, re-ranking, caching) improve retrieval quality and speed.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['retrieval-strategies', 'rag-implementation', 'rag-evaluation'],
    resources: [
      { title: 'Advanced RAG Guide', url: 'https://docs.spring.io/spring-ai/reference/api/rag.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'rag-evaluation',
    number: 30,
    title: 'RAG Evaluation',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'rag',
    objectives: [
      'Evaluate RAG system quality',
      'Use LLM-as-a-Judge',
      'Measure retrieval and generation quality'
    ],
    prerequisites: [
      { lessonId: 'rag-advanced', description: 'Understand advanced RAG' },
      { lessonId: 'evaluation-basics', description: 'Understand evaluation concepts' }
    ],
    mdxFiles: {
      concept: 'concepts/30-rag-evaluation.mdx',
      visual: 'concepts/30-rag-evaluation.mdx',
      code: 'concepts/30-rag-evaluation.mdx',
      interactive: 'concepts/30-rag-evaluation.mdx'
    },
    analogies: [
      {
        springConcept: 'Unit Testing / Integration Testing',
        aiConcept: 'RAG evaluation as testing',
        explanation: 'Just as unit tests verify code correctness, RAG evaluation verifies retrieval and generation quality using metrics and LLM-as-a-Judge.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['rag-advanced', 'evaluation-basics'],
    resources: [
      { title: 'RAG Evaluation Guide', url: 'https://docs.spring.io/spring-ai/reference/api/evaluation.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'query-transformation',
    number: 31,
    title: 'Query Transformation',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'rag',
    objectives: [
      'Understand query rewriting',
      'Implement HyDE and other transformation strategies',
      'Improve retrieval with query understanding'
    ],
    prerequisites: [{ lessonId: 'retrieval-strategies', description: 'Understand retrieval strategies' }],
    mdxFiles: {
      concept: 'concepts/31-query-transformation.mdx',
      visual: 'concepts/31-query-transformation.mdx',
      code: 'concepts/31-query-transformation.mdx',
      interactive: 'concepts/31-query-transformation.mdx'
    },
    analogies: [
      {
        springConcept: 'MessageConverter / ContentNegotiation',
        aiConcept: 'Query transformation adapts input',
        explanation: 'Just as ContentNegotiation adapts request format to response format, query transformation adapts user questions to better match document content.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['retrieval-strategies', 'rag-advanced'],
    resources: [
      { title: 'Query Transformation Guide', url: 'https://docs.spring.io/spring-ai/reference/api/retrieval.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5 — Advisors & Memory
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'advisors-concept',
    number: 32,
    title: 'Advisors API',
    difficulty: 'intermediate',
    estimatedTime: 18,
    phase: 'memory',
    objectives: [
      'Understand the Advisor pattern',
      'Implement SimpleLoggerAdvisor',
      'Understand advisor chain ordering (HIGHEST_PRECEDENCE)',
      'Build custom advisors'
    ],
    prerequisites: [{ lessonId: 'chat-client', description: 'Understand ChatClient basics' }],
    mdxFiles: {
      concept: 'concepts/32-advisors-concept.mdx',
      visual: 'concepts/32-advisors-concept.mdx',
      code: 'concepts/32-advisors-concept.mdx',
      interactive: 'concepts/32-advisors-concept.mdx'
    },
    analogies: [
      {
        springConcept: 'Servlet Filter / HandlerInterceptor',
        aiConcept: 'Advisor chain wrapping the chat call',
        explanation: 'Just as Servlet Filters intercept requests before they reach the controller, Advisors intercept LLM calls before they reach the model, forming a chain.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['chat-client', 'chat-memory', 'custom-advisors', 'rag-advanced'],
    resources: [
      { title: 'Advisors Guide', url: 'https://docs.spring.io/spring-ai/reference/api/advisor.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'chat-memory',
    number: 33,
    title: 'Chat Memory',
    difficulty: 'intermediate',
    estimatedTime: 15,
    phase: 'memory',
    objectives: [
      'Understand ChatMemory interface',
      'Use conversationId to scope conversations',
      'Configure InMemory vs JdbcChatMemoryRepository',
      'Manage conversation history'
    ],
    prerequisites: [
      { lessonId: 'advisors-concept', description: 'Understand Advisor pattern' },
      { lessonId: 'chat-client', description: 'Understand ChatClient' }
    ],
    mdxFiles: {
      concept: 'concepts/33-chat-memory.mdx',
      visual: 'concepts/33-chat-memory.mdx',
      code: 'concepts/33-chat-memory.mdx',
      interactive: 'concepts/33-chat-memory.mdx'
    },
    analogies: [
      {
        springConcept: 'HttpSession / Conversation scope',
        aiConcept: 'ChatMemory with conversationId',
        explanation: 'Just as HttpSession maintains user state across requests, ChatMemory maintains conversation context across multiple LLM calls using a conversationId.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['advisors-concept', 'vector-store-memory', 'conversation-memory'],
    resources: [
      { title: 'Chat Memory Guide', url: 'https://docs.spring.io/spring-ai/reference/api/chat-memory.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'conversation-memory',
    number: 34,
    title: 'Conversation Memory',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'memory',
    objectives: [
      'Implement conversation memory patterns',
      'Use VectorStore-backed memory',
      'Manage long-term conversational context'
    ],
    prerequisites: [{ lessonId: 'chat-memory', description: 'Understand ChatMemory basics' }],
    mdxFiles: {
      concept: 'concepts/34-conversation-memory.mdx',
      visual: 'concepts/34-conversation-memory.mdx',
      code: 'concepts/34-conversation-memory.mdx',
      interactive: 'concepts/34-conversation-memory.mdx'
    },
    analogies: [
      {
        springConcept: 'Caching / Persistent Session',
        aiConcept: 'VectorStore-backed conversation memory',
        explanation: 'Just as persistent session storage maintains user state across server restarts, VectorStore-backed memory persists conversation context across sessions.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['chat-memory', 'vector-store-memory', 'advisors-concept'],
    resources: [
      { title: 'Conversation Memory Guide', url: 'https://docs.spring.io/spring-ai/reference/api/chat-memory.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'vector-store-memory',
    number: 35,
    title: 'VectorStore-Backed Memory',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'memory',
    objectives: [
      'Use VectorStore for long-term memory',
      'Implement semantic memory retrieval',
      'Combine memory with RAG'
    ],
    prerequisites: [
      { lessonId: 'conversation-memory', description: 'Understand conversation memory' },
      { lessonId: 'vector-store-fundamentals', description: 'Understand VectorStore' }
    ],
    mdxFiles: {
      concept: 'concepts/35-vector-store-memory.mdx',
      visual: 'concepts/35-vector-store-memory.mdx',
      code: 'concepts/35-vector-store-memory.mdx',
      interactive: 'concepts/35-vector-store-memory.mdx'
    },
    analogies: [
      {
        springConcept: 'Second-Level Cache / Persistent Store',
        aiConcept: 'VectorStore as semantic memory store',
        explanation: 'Just as a second-level cache persists data beyond a single session, VectorStore-backed memory persists conversation context semantically for long-term recall.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['conversation-memory', 'chat-memory', 'rag-advanced'],
    resources: [
      { title: 'VectorStore Memory Guide', url: 'https://docs.spring.io/spring-ai/reference/api/chat-memory.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'custom-advisors',
    number: 36,
    title: 'Custom Advisors',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'memory',
    objectives: [
      'Build custom advisor implementations',
      'Create RAG advisor chains',
      'Implement safety and validation advisors'
    ],
    prerequisites: [{ lessonId: 'advisors-concept', description: 'Understand Advisor pattern' }],
    mdxFiles: {
      concept: 'concepts/36-custom-advisors.mdx',
      visual: 'concepts/36-custom-advisors.mdx',
      code: 'concepts/36-custom-advisors.mdx',
      interactive: 'concepts/36-custom-advisors.mdx'
    },
    analogies: [
      {
        springConcept: 'Custom HandlerInterceptor / Filter',
        aiConcept: 'Custom Advisor implementation',
        explanation: 'Just as a custom HandlerInterceptor adds pre/post processing to requests, a custom Advisor adds pre/post processing to LLM calls.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['advisors-concept', 'rag-advanced', 'chat-memory'],
    resources: [
      { title: 'Custom Advisors Guide', url: 'https://docs.spring.io/spring-ai/reference/api/advisor.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6 — Tool Calling
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tool-calling-implementation',
    number: 37,
    title: 'Tool Calling Implementation',
    difficulty: 'intermediate',
    estimatedTime: 20,
    phase: 'tools',
    objectives: [
      'Use @Tool and @ToolParam annotations',
      'Register tool callbacks with ChatClient',
      'Understand the tool calling loop',
      'Handle tool errors'
    ],
    prerequisites: [
      { lessonId: 'tool-calling-concept', description: 'Understand tool calling concept' },
      { lessonId: 'chat-client', description: 'Understand ChatClient' }
    ],
    mdxFiles: {
      concept: 'concepts/37-tool-calling-implementation.mdx',
      visual: 'concepts/37-tool-calling-implementation.mdx',
      code: 'concepts/37-tool-calling-implementation.mdx',
      interactive: 'concepts/37-tool-calling-implementation.mdx'
    },
    analogies: [
      {
        springConcept: '@Scheduled / @EventListener',
        aiConcept: '@Tool annotation marks callable methods',
        explanation: 'Just as @Scheduled marks a method for periodic execution, @Tool marks a method for LLM invocation when the model decides it is needed.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: true, showApiInspector: true, showCheckpoint: true },
    relatedLessons: ['tool-calling-concept', 'agents-fundamentals', 'multiple-tools'],
    resources: [
      { title: 'Tool Calling Guide', url: 'https://docs.spring.io/spring-ai/reference/api/tool-calling.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'tool-calling'
  },
  {
    id: 'multiple-tools',
    number: 38,
    title: 'Multiple Tools & Tool Errors',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'tools',
    objectives: [
      'Manage multiple tools in a single agent',
      'Handle tool execution errors gracefully',
      'Implement tool error recovery'
    ],
    prerequisites: [{ lessonId: 'tool-calling-implementation', description: 'Implement basic tool calling' }],
    mdxFiles: {
      concept: 'concepts/38-multiple-tools.mdx',
      visual: 'concepts/38-multiple-tools.mdx',
      code: 'concepts/38-multiple-tools.mdx',
      interactive: 'concepts/38-multiple-tools.mdx'
    },
    analogies: [
      {
        springConcept: 'ExceptionHandler / @ControllerAdvice',
        aiConcept: 'Tool error handling',
        explanation: 'Just as @ControllerAdvice handles exceptions globally, tool error handling catches and recovers from tool execution failures in the agent loop.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['tool-calling-implementation', 'tool-calling-loop', 'agents-fundamentals'],
    resources: [
      { title: 'Multiple Tools Guide', url: 'https://docs.spring.io/spring-ai/reference/api/tool-calling.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'tool-calling-loop',
    number: 39,
    title: 'Tool Calling Loop',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'tools',
    objectives: [
      'Understand the multi-turn tool calling loop',
      'Implement tools + memory combination',
      'Implement tools + RAG combination'
    ],
    prerequisites: [
      { lessonId: 'tool-calling-implementation', description: 'Implement basic tool calling' },
      { lessonId: 'chat-memory', description: 'Understand ChatMemory' }
    ],
    mdxFiles: {
      concept: 'concepts/39-tool-calling-loop.mdx',
      visual: 'concepts/39-tool-calling-loop.mdx',
      code: 'concepts/39-tool-calling-loop.mdx',
      interactive: 'concepts/39-tool-calling-loop.mdx'
    },
    analogies: [
      {
        springConcept: 'TransactionManager / RetryTemplate',
        aiConcept: 'Tool calling loop as a retry mechanism',
        explanation: 'Just as RetryTemplate retries operations on failure, the tool calling loop iterates between the LLM and tools until a satisfactory answer is produced.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['tool-calling-implementation', 'multiple-tools', 'tools-memory', 'tools-rag'],
    resources: [
      { title: 'Tool Calling Loop Guide', url: 'https://docs.spring.io/spring-ai/reference/api/tool-calling.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'tools-memory',
    number: 40,
    title: 'Tools + Memory',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'tools',
    objectives: [
      'Combine tool calling with chat memory',
      'Build agents that remember past interactions',
      'Use memory to inform tool selection'
    ],
    prerequisites: [
      { lessonId: 'tool-calling-loop', description: 'Understand tool calling loop' },
      { lessonId: 'chat-memory', description: 'Understand ChatMemory' }
    ],
    mdxFiles: {
      concept: 'concepts/40-tools-memory.mdx',
      visual: 'concepts/40-tools-memory.mdx',
      code: 'concepts/40-tools-memory.mdx',
      interactive: 'concepts/40-tools-memory.mdx'
    },
    analogies: [
      {
        springConcept: 'Stateful Session Bean',
        aiConcept: 'Agent with memory and tools',
        explanation: 'Just as a stateful session bean maintains context across method calls, an agent with memory maintains conversational context while using tools.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['tool-calling-loop', 'chat-memory', 'multiple-tools'],
    resources: [
      { title: 'Tools + Memory Guide', url: 'https://docs.spring.io/spring-ai/reference/api/tool-calling.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'tools-rag',
    number: 41,
    title: 'Tools + RAG',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'tools',
    objectives: [
      'Combine tool calling with RAG retrieval',
      'Build agents that retrieve documents AND use tools',
      'Optimize agent performance with both capabilities'
    ],
    prerequisites: [
      { lessonId: 'tool-calling-implementation', description: 'Implement basic tool calling' },
      { lessonId: 'rag-implementation', description: 'Build a RAG pipeline' }
    ],
    mdxFiles: {
      concept: 'concepts/41-tools-rag.mdx',
      visual: 'concepts/41-tools-rag.mdx',
      code: 'concepts/41-tools-rag.mdx',
      interactive: 'concepts/41-tools-rag.mdx'
    },
    analogies: [
      {
        springConcept: 'AspectJ / Aspect-Oriented Programming',
        aiConcept: 'RAG + Tools as cross-cutting concerns',
        explanation: 'Just as AOP adds cross-cutting concerns (logging, security), combining RAG (knowledge retrieval) and tools (action execution) creates a comprehensive agent.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['tools-memory', 'rag-implementation', 'tool-calling-implementation'],
    resources: [
      { title: 'Tools + RAG Guide', url: 'https://docs.spring.io/spring-ai/reference/api/tool-calling.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 7 — Agents
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'agents-fundamentals',
    number: 42,
    title: 'Agent Fundamentals',
    difficulty: 'intermediate',
    estimatedTime: 18,
    phase: 'agents',
    objectives: [
      'Understand the agent loop',
      'Implement tool-driven agents',
      'Understand when to use agents vs simple tool calling'
    ],
    prerequisites: [
      { lessonId: 'tool-calling-concept', description: 'Understand tool calling concept' },
      { lessonId: 'tool-calling-implementation', description: 'Implement tool calling' }
    ],
    mdxFiles: {
      concept: 'concepts/42-agent-fundamentals.mdx',
      visual: 'concepts/42-agent-fundamentals.mdx',
      code: 'concepts/42-agent-fundamentals.mdx',
      interactive: 'concepts/42-agent-fundamentals.mdx'
    },
    analogies: [
      {
        springConcept: 'StateMachine / WorkflowExecution',
        aiConcept: 'Agent loop',
        explanation: 'Just as a Spring State Machine transitions between states based on events, an agent loops through think → act → observe → repeat until the task is complete.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['tool-calling-concept', 'tool-calling-implementation', 'agent-planning'],
    resources: [
      { title: 'Agents Guide', url: 'https://docs.spring.io/spring-ai/reference/api/agent.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'agent-planning',
    number: 43,
    title: 'Agent Planning',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'agents',
    objectives: [
      'Implement planning agents',
      'Understand multi-step execution',
      'Create agents that break down complex tasks'
    ],
    prerequisites: [{ lessonId: 'agents-fundamentals', description: 'Understand agent fundamentals' }],
    mdxFiles: {
      concept: 'concepts/43-agent-planning.mdx',
      visual: 'concepts/43-agent-planning.mdx',
      code: 'concepts/43-agent-planning.mdx',
      interactive: 'concepts/43-agent-planning.mdx'
    },
    analogies: [
      {
        springConcept: 'TaskExecutor / AsyncConfigurer',
        aiConcept: 'Agent planning as task decomposition',
        explanation: 'Just as TaskExecutor breaks work into async subtasks, agent planning breaks complex tasks into sequential subtasks that the agent executes step by step.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['agents-fundamentals', 'multi-step-execution', 'agent-safety'],
    resources: [
      { title: 'Agent Planning Guide', url: 'https://docs.spring.ai/reference/api/agent.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'multi-step-execution',
    number: 44,
    title: 'Multi-Step Execution',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'agents',
    objectives: [
      'Implement multi-step agent workflows',
      'Handle complex execution paths',
      'Manage agent state across steps'
    ],
    prerequisites: [{ lessonId: 'agent-planning', description: 'Understand agent planning' }],
    mdxFiles: {
      concept: 'concepts/44-multi-step-execution.mdx',
      visual: 'concepts/44-multi-step-execution.mdx',
      code: 'concepts/44-multi-step-execution.mdx',
      interactive: 'concepts/44-multi-step-execution.mdx'
    },
    analogies: [
      {
        springConcept: 'StateMachine / Batch Job',
        aiConcept: 'Multi-step agent execution',
        explanation: 'Just as a batch job processes items in multiple stages, multi-step agents execute complex workflows through a series of planned steps.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['agent-planning', 'agent-safety', 'agents-fundamentals'],
    resources: [
      { title: 'Multi-Step Execution Guide', url: 'https://docs.spring.io/spring-ai/reference/api/agent.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'agent-safety',
    number: 45,
    title: 'Agent Safety',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'agents',
    objectives: [
      'Implement safety guardrails for agents',
      'Understand agent constraints',
      'Handle agent misbehavior'
    ],
    prerequisites: [{ lessonId: 'agents-fundamentals', description: 'Understand agent fundamentals' }],
    mdxFiles: {
      concept: 'concepts/45-agent-safety.mdx',
      visual: 'concepts/45-agent-safety.mdx',
      code: 'concepts/45-agent-safety.mdx',
      interactive: 'concepts/45-agent-safety.mdx'
    },
    analogies: [
      {
        springConcept: 'Spring Security / Authorization',
        aiConcept: 'Agent safety guardrails',
        explanation: 'Just as Spring Security enforces authorization rules on method access, agent safety guardrails constrain what actions an agent can take and prevent harmful behavior.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['agents-fundamentals', 'multi-step-execution', 'advisors-concept'],
    resources: [
      { title: 'Agent Safety Guide', url: 'https://docs.spring.io/spring-ai/reference/api/agent.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 8 — MCP
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'mcp-architecture',
    number: 46,
    title: 'MCP Architecture',
    difficulty: 'intermediate',
    estimatedTime: 18,
    phase: 'mcp',
    objectives: [
      'Understand MCP client-server architecture',
      'Learn MCP protocol fundamentals',
      'Understand tools, resources, and prompts in MCP'
    ],
    prerequisites: [{ lessonId: 'mcp-concept', description: 'Understand MCP concept' }],
    mdxFiles: {
      concept: 'concepts/46-mcp-architecture.mdx',
      visual: 'concepts/46-mcp-architecture.mdx',
      code: 'concepts/46-mcp-architecture.mdx',
      interactive: 'concepts/46-mcp-architecture.mdx'
    },
    analogies: [
      {
        springConcept: 'REST API / Microservices',
        aiConcept: 'MCP client-server architecture',
        explanation: 'Just as microservices communicate via REST APIs, MCP servers expose tools and resources that MCP clients can discover and invoke through a standard protocol.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['mcp-concept', 'mcp-tools', 'build-mcp-server'],
    resources: [
      { title: 'MCP Architecture Guide', url: 'https://modelcontextprotocol.io/docs', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 },
    featureId: 'mcp'
  },
  {
    id: 'mcp-tools',
    number: 47,
    title: 'MCP Tools & Resources',
    difficulty: 'intermediate',
    estimatedTime: 15,
    phase: 'mcp',
    objectives: [
      'Define MCP tools and resources',
      'Use MCP prompts',
      'Implement tool discovery and invocation'
    ],
    prerequisites: [{ lessonId: 'mcp-architecture', description: 'Understand MCP architecture' }],
    mdxFiles: {
      concept: 'concepts/47-mcp-tools.mdx',
      visual: 'concepts/47-mcp-tools.mdx',
      code: 'concepts/47-mcp-tools.mdx',
      interactive: 'concepts/47-mcp-tools.mdx'
    },
    analogies: [
      {
        springConcept: '@Repository / @Service stereotype',
        aiConcept: 'MCP tools as registered services',
        explanation: 'Just as @Repository marks data access classes and @Service marks business logic classes, MCP tools and resources are registered with specific roles in the MCP ecosystem.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['mcp-architecture', 'consume-mcp-server', 'spring-mcp-integration'],
    resources: [
      { title: 'MCP Tools Guide', url: 'https://docs.spring.io/spring-ai/reference/api/mcp.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'spring-mcp-integration',
    number: 48,
    title: 'Spring AI MCP Integration',
    difficulty: 'intermediate',
    estimatedTime: 18,
    phase: 'mcp',
    objectives: [
      'Use spring-ai-starter-mcp-server',
      'Use spring-ai-starter-mcp-client',
      'Configure MCP servers and clients'
    ],
    prerequisites: [{ lessonId: 'mcp-architecture', description: 'Understand MCP architecture' }],
    mdxFiles: {
      concept: 'concepts/48-spring-mcp-integration.mdx',
      visual: 'concepts/48-spring-mcp-integration.mdx',
      code: 'concepts/48-spring-mcp-integration.mdx',
      interactive: 'concepts/48-spring-mcp-integration.mdx'
    },
    analogies: [
      {
        springConcept: 'Spring Boot AutoConfiguration',
        aiConcept: 'Spring AI MCP auto-configuration',
        explanation: 'Just as Spring Boot AutoConfiguration sets up beans based on classpath, Spring AI MCP starters auto-configure MCP servers and clients based on dependencies.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['mcp-architecture', 'mcp-tools', 'build-mcp-server'],
    resources: [
      { title: 'Spring MCP Integration Guide', url: 'https://docs.spring.io/spring-ai/reference/api/mcp.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'build-mcp-server',
    number: 49,
    title: 'Build an MCP Server',
    difficulty: 'advanced',
    estimatedTime: 20,
    phase: 'mcp',
    objectives: [
      'Build a custom MCP server',
      'Implement tools, resources, and prompts',
      'Deploy and test an MCP server'
    ],
    prerequisites: [
      { lessonId: 'spring-mcp-integration', description: 'Understand Spring MCP integration' },
      { lessonId: 'tool-calling-implementation', description: 'Understand tool calling' }
    ],
    mdxFiles: {
      concept: 'concepts/49-build-mcp-server.mdx',
      visual: 'concepts/49-build-mcp-server.mdx',
      code: 'concepts/49-build-mcp-server.mdx',
      interactive: 'concepts/49-build-mcp-server.mdx'
    },
    analogies: [
      {
        springConcept: 'Custom Repository / Controller',
        aiConcept: 'Custom MCP server',
        explanation: 'Just as a custom @RestController exposes HTTP endpoints, a custom MCP server exposes tools and resources through the MCP protocol.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['spring-mcp-integration', 'consume-mcp-server', 'tool-calling-implementation'],
    resources: [
      { title: 'Build MCP Server Guide', url: 'https://docs.spring.io/spring-ai/reference/api/mcp.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'consume-mcp-server',
    number: 50,
    title: 'Consume an MCP Server',
    difficulty: 'advanced',
    estimatedTime: 18,
    phase: 'mcp',
    objectives: [
      'Connect to an existing MCP server',
      'Use MCP tools from your Spring AI app',
      'Handle MCP client configuration'
    ],
    prerequisites: [{ lessonId: 'spring-mcp-integration', description: 'Understand Spring MCP integration' }],
    mdxFiles: {
      concept: 'concepts/50-consume-mcp-server.mdx',
      visual: 'concepts/50-consume-mcp-server.mdx',
      code: 'concepts/50-consume-mcp-server.mdx',
      interactive: 'concepts/50-consume-mcp-server.mdx'
    },
    analogies: [
      {
        springConcept: 'FeignClient / RestTemplate',
        aiConcept: 'MCP client connecting to an MCP server',
        explanation: 'Just as FeignClient connects to remote HTTP services, an MCP client connects to MCP servers and invokes their tools through the MCP protocol.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['build-mcp-server', 'spring-mcp-integration'],
    resources: [
      { title: 'Consume MCP Server Guide', url: 'https://docs.spring.io/spring-ai/reference/api/mcp.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 9 — Production
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'auto-configuration',
    number: 51,
    title: 'Auto Configuration',
    difficulty: 'intermediate',
    estimatedTime: 12,
    phase: 'production',
    objectives: [
      'Understand Spring Boot auto-configuration for Spring AI',
      'Configure properties for model providers',
      'Customize default beans'
    ],
    prerequisites: [{ lessonId: 'chat-model', description: 'Understand ChatModel configuration' }],
    mdxFiles: {
      concept: 'concepts/51-auto-configuration.mdx',
      visual: 'concepts/51-auto-configuration.mdx',
      code: 'concepts/51-auto-configuration.mdx',
      interactive: 'concepts/51-auto-configuration.mdx'
    },
    analogies: [
      {
        springConcept: 'spring.factories / @AutoConfiguration',
        aiConcept: 'Spring AI auto-configuration',
        explanation: 'Just as Spring Boot auto-configuration creates beans from classpath dependencies, Spring AI auto-configuration creates ChatClient and ChatModel beans from properties.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['chat-model', 'chat-client', 'observability'],
    resources: [
      { title: 'Auto Configuration Guide', url: 'https://docs.spring.io/spring-ai/reference/api/configuration.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'observability',
    number: 52,
    title: 'Observability',
    difficulty: 'intermediate',
    estimatedTime: 18,
    phase: 'production',
    objectives: [
      'Add Micrometer tracing with OpenTelemetry',
      'Understand Spring AI auto-instrumentation',
      'Expose actuator endpoints',
      'Monitor AI operations'
    ],
    prerequisites: [
      { lessonId: 'chat-model', description: 'Understand ChatModel' },
      { lessonId: 'auto-configuration', description: 'Understand auto-configuration' }
    ],
    mdxFiles: {
      concept: 'concepts/52-observability.mdx',
      visual: 'concepts/52-observability.mdx',
      code: 'concepts/52-observability.mdx',
      interactive: 'concepts/52-observability.mdx'
    },
    analogies: [
      {
        springConcept: 'Micrometer + Actuator',
        aiConcept: 'Spring AI observability',
        explanation: 'Just as Micrometer + Actuator monitor application health and performance, Spring AI observability monitors AI operations (token usage, latency, errors).'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showApiInspector: true, showCheckpoint: true },
    relatedLessons: ['auto-configuration', 'logging', 'metrics', 'ai-metrics'],
    resources: [
      { title: 'Observability Guide', url: 'https://docs.spring.io/spring-ai/reference/api/observability.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'logging',
    number: 53,
    title: 'Logging for AI Operations',
    difficulty: 'beginner',
    estimatedTime: 10,
    phase: 'production',
    objectives: [
      'Configure logging for LLM calls',
      'Use SimpleLoggerAdvisor',
      'Track request/response logging'
    ],
    prerequisites: [{ lessonId: 'advisors-concept', description: 'Understand Advisor pattern' }],
    mdxFiles: {
      concept: 'concepts/53-logging.mdx',
      visual: 'concepts/53-logging.mdx',
      code: 'concepts/53-logging.mdx',
      interactive: 'concepts/53-logging.mdx'
    },
    analogies: [
      {
        springConcept: 'HandlerInterceptor / AOP logging',
        aiConcept: 'SimpleLoggerAdvisor for LLM calls',
        explanation: 'Just as HandlerInterceptor logs HTTP request/response details, SimpleLoggerAdvisor logs LLM request/response details including prompts and responses.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['advisors-concept', 'observability', 'eval-basic'],
    resources: [
      { title: 'Logging Guide', url: 'https://docs.spring.io/spring-ai/reference/api/logging.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'metrics',
    number: 54,
    title: 'Metrics & Cost Tracking',
    difficulty: 'intermediate',
    estimatedTime: 12,
    phase: 'production',
    objectives: [
      'Track token usage and costs',
      'Use Micrometer metrics for AI operations',
      'Implement cost-aware application design'
    ],
    prerequisites: [{ lessonId: 'observability', description: 'Understand observability basics' }],
    mdxFiles: {
      concept: 'concepts/54-metrics.mdx',
      visual: 'concepts/54-metrics.mdx',
      code: 'concepts/54-metrics.mdx',
      interactive: 'concepts/54-metrics.mdx'
    },
    analogies: [
      {
        springConcept: 'MeterRegistry / Gauge',
        aiConcept: 'AI metrics (tokens, latency, cost)',
        explanation: 'Just as MeterRegistry tracks application metrics, Micrometer tracks AI metrics like token usage, latency, and estimated cost per operation.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['observability', 'ai-metrics', 'cost-optimization'],
    resources: [
      { title: 'Metrics Guide', url: 'https://docs.spring.io/spring-ai/reference/api/metrics.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'evaluation-basics',
    number: 55,
    title: 'Evaluation Fundamentals',
    difficulty: 'intermediate',
    estimatedTime: 15,
    phase: 'production',
    objectives: [
      'Understand LLM-as-a-Judge',
      'Evaluate answers for relevancy',
      'Fact-check answers against context'
    ],
    prerequisites: [
      { lessonId: 'chat-model', description: 'Understand ChatModel' },
      { lessonId: 'rag-evaluation', description: 'Understand RAG evaluation' }
    ],
    mdxFiles: {
      concept: 'concepts/55-evaluation-basics.mdx',
      visual: 'concepts/55-evaluation-basics.mdx',
      code: 'concepts/55-evaluation-basics.mdx',
      interactive: 'concepts/55-evaluation-basics.mdx'
    },
    analogies: [
      {
        springConcept: 'Unit Testing / Mock',
        aiConcept: 'LLM-as-a-Judge evaluation',
        explanation: 'Just as unit tests verify code behavior, LLM-as-a-Judge verifies answer quality by asking a second LLM to evaluate the first answer.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['rag-evaluation', 'eval-relevancy', 'eval-factcheck'],
    resources: [
      { title: 'Evaluation Guide', url: 'https://docs.spring.io/spring-ai/reference/api/evaluation.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'eval-relevancy',
    number: 56,
    title: 'Relevancy Evaluation',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'production',
    objectives: [
      'Implement relevancy evaluation',
      'Measure if answers address questions',
      'Automate evaluation in CI/CD'
    ],
    prerequisites: [{ lessonId: 'evaluation-basics', description: 'Understand evaluation fundamentals' }],
    mdxFiles: {
      concept: 'concepts/56-eval-relevancy.mdx',
      visual: 'concepts/56-eval-relevancy.mdx',
      code: 'concepts/56-eval-relevancy.mdx',
      interactive: 'concepts/56-eval-relevancy.mdx'
    },
    analogies: [
      {
        springConcept: 'Assertion / Validator',
        aiConcept: 'Relevancy evaluation as validation',
        explanation: 'Just as assertions verify that code meets expected conditions, relevancy evaluation verifies that LLM answers meet expected quality criteria.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['evaluation-basics', 'eval-factcheck', 'eval-security'],
    resources: [
      { title: 'Relevancy Evaluation Guide', url: 'https://docs.spring.io/spring-ai/reference/api/evaluation.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'eval-factcheck',
    number: 57,
    title: 'Fact-Check Evaluation',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'production',
    objectives: [
      'Implement fact-check evaluation',
      'Verify answers against provided context',
      'Build evaluation pipelines'
    ],
    prerequisites: [{ lessonId: 'evaluation-basics', description: 'Understand evaluation fundamentals' }],
    mdxFiles: {
      concept: 'concepts/57-eval-factcheck.mdx',
      visual: 'concepts/57-eval-factcheck.mdx',
      code: 'concepts/57-eval-factcheck.mdx',
      interactive: 'concepts/57-eval-factcheck.mdx'
    },
    analogies: [
      {
        springConcept: 'AssertJ / Truth assertions',
        aiConcept: 'Fact-check evaluation as assertions',
        explanation: 'Just as AssertJ provides fluent assertions for testing, fact-check evaluation provides fluent assertions for verifying LLM answers against context.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['evaluation-basics', 'eval-relevancy', 'eval-security'],
    resources: [
      { title: 'Fact-Check Evaluation Guide', url: 'https://docs.spring.io/spring-ai/reference/api/evaluation.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'eval-security',
    number: 58,
    title: 'Evaluation Security',
    difficulty: 'advanced',
    estimatedTime: 12,
    phase: 'production',
    objectives: [
      'Evaluate security of LLM outputs',
      'Implement safety evaluation pipelines',
      'Understand guardrail evaluation'
    ],
    prerequisites: [
      { lessonId: 'evaluation-basics', description: 'Understand evaluation fundamentals' },
      { lessonId: 'moderation-basic', description: 'Understand moderation' }
    ],
    mdxFiles: {
      concept: 'concepts/58-eval-security.mdx',
      visual: 'concepts/58-eval-security.mdx',
      code: 'concepts/58-eval-security.mdx',
      interactive: 'concepts/58-eval-security.mdx'
    },
    analogies: [
      {
        springConcept: 'SecurityScanner / Vulnerability Assessment',
        aiConcept: 'Security evaluation of LLM outputs',
        explanation: 'Just as security scanners check code for vulnerabilities, security evaluation checks LLM outputs for harmful, biased, or unsafe content.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: false, showCodeDiff: false, showCheckpoint: true },
    relatedLessons: ['eval-relevancy', 'eval-factcheck', 'moderation-basic'],
    resources: [
      { title: 'Security Evaluation Guide', url: 'https://docs.spring.io/spring-ai/reference/api/evaluation.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'cost-performance',
    number: 59,
    title: 'Cost & Performance Optimization',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'production',
    objectives: [
      'Understand cost factors in LLM applications',
      'Optimize prompt size and model selection',
      'Implement caching strategies',
      'Benchmark and optimize performance'
    ],
    prerequisites: [{ lessonId: 'metrics', description: 'Understand metrics and cost tracking' }],
    mdxFiles: {
      concept: 'concepts/59-cost-performance.mdx',
      visual: 'concepts/59-cost-performance.mdx',
      code: 'concepts/59-cost-performance.mdx',
      interactive: 'concepts/59-cost-performance.mdx'
    },
    analogies: [
      {
        springConcept: 'Connection Pooling / Caching',
        aiConcept: 'LLM cost optimization strategies',
        explanation: 'Just as connection pooling and caching optimize resource usage, caching LLM responses, optimizing prompt size, and choosing appropriate models optimize AI costs.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['metrics', 'model-options', 'provider-strategy', 'auto-configuration'],
    resources: [
      { title: 'Cost Optimization Guide', url: 'https://docs.spring.io/spring-ai/reference/api/performance.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },
  {
    id: 'security-production',
    number: 60,
    title: 'Production Security & Error Handling',
    difficulty: 'advanced',
    estimatedTime: 15,
    phase: 'production',
    objectives: [
      'Implement security best practices for LLM apps',
      'Handle LLM errors gracefully',
      'Understand provider switching strategies',
      'Build resilient production architectures'
    ],
    prerequisites: [
      { lessonId: 'error-handling', description: 'Understand error handling basics' },
      { lessonId: 'provider-strategy', description: 'Understand provider abstraction' }
    ],
    mdxFiles: {
      concept: 'concepts/60-security-production.mdx',
      visual: 'concepts/60-security-production.mdx',
      code: 'concepts/60-security-production.mdx',
      interactive: 'concepts/60-security-production.mdx'
    },
    analogies: [
      {
        springConcept: 'Spring Security / Circuit Breaker',
        aiConcept: 'Production security for LLM apps',
        explanation: 'Just as Spring Security and Resilience4j protect applications from failures, production security patterns protect LLM applications from hallucinations, prompt injection, and provider failures.'
      }
    ],
    interactive: { showSplitPane: false, showArchitectureDiagram: true, showCodeDiff: true, showCheckpoint: true },
    relatedLessons: ['provider-strategy', 'error-handling', 'cost-performance', 'moderation-basic'],
    resources: [
      { title: 'Production Security Guide', url: 'https://docs.spring.io/spring-ai/reference/api/security.html', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 10 — Capstone
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'capstone-support-assistant',
    number: 61,
    title: 'Capstone: Spring AI Support Assistant',
    difficulty: 'expert',
    estimatedTime: 60,
    phase: 'capstone',
    objectives: [
      'Build a complete Spring AI Support Assistant',
      'Integrate RAG, Tool Calling, Memory, MCP',
      'Implement structured output, observability, evaluation',
      'Deploy and validate the complete application locally'
    ],
    prerequisites: [
      { lessonId: 'rag-implementation', description: 'Build a complete RAG pipeline' },
      { lessonId: 'tool-calling-implementation', description: 'Implement tool calling' },
      { lessonId: 'chat-memory', description: 'Understand ChatMemory' },
      { lessonId: 'observability', description: 'Understand observability' },
      { lessonId: 'evaluation-basics', description: 'Understand evaluation' }
    ],
    mdxFiles: {
      concept: 'concepts/61-capstone.mdx',
      visual: 'concepts/61-capstone.mdx',
      code: 'concepts/61-capstone.mdx',
      interactive: 'concepts/61-capstone.mdx'
    },
    analogies: [
      {
        springConcept: 'Spring Boot Application',
        aiConcept: 'Complete Spring AI application',
        explanation: 'Just as a full Spring Boot application combines all Spring features (Security, Data, Web, Batch), the Capstone combines all Spring AI features into one complete application.'
      }
    ],
    interactive: { showSplitPane: true, showArchitectureDiagram: true, showCodeDiff: true, showApiInspector: true, showCheckpoint: true },
    relatedLessons: [
      'rag-implementation', 'tool-calling-implementation', 'chat-memory',
      'observability', 'evaluation-basics', 'security-production',
      'mcp-architecture', 'auto-configuration', 'cost-performance'
    ],
    resources: [
      { title: 'Capstone Project Repository', url: 'https://docs.spring.io/spring-ai/reference/', type: 'documentation' }
    ],
    masteryCriteria: { mustCompleteCheckpoint: true, maxAttemptsAllowed: 3 }
  }
]

/** Phase definitions for the learning sidebar */
export const learningPhases = [
  { id: 'prerequisites', title: 'Prerequisites', icon: '📚', color: '#64748b' },
  { id: 'fundamentals', title: 'Foundation', icon: '🏗️', color: '#3b82f6' },
  { id: 'models', title: 'Models', icon: '🤖', color: '#10b981' },
  { id: 'data', title: 'Data', icon: '📊', color: '#f59e0b' },
  { id: 'rag', title: 'RAG', icon: '🔍', color: '#8b5cf6' },
  { id: 'memory', title: 'Memory', icon: '💾', color: '#ec4899' },
  { id: 'tools', title: 'Tools', icon: '🔧', color: '#f97316' },
  { id: 'agents', title: 'Agents', icon: '🦾', color: '#14b8a6' },
  { id: 'mcp', title: 'MCP', icon: '🔗', color: '#a855f7' },
  { id: 'production', title: 'Production', icon: '🚀', color: '#059669' },
  { id: 'capstone', title: 'Capstone', icon: '🏆', color: '#ef4444' }
]

/** Helper: get lesson by ID */
export function getLesson(id: string): Lesson | undefined {
  return lessons.find(l => l.id === id)
}

/** Helper: get lesson by number */
export function getLessonByNumber(num: number): Lesson | undefined {
  return lessons.find(l => l.number === num)
}

/** Helper: get next lesson */
export function getNextLesson(currentId: string): Lesson | undefined {
  const current = getLesson(currentId)
  if (!current) return undefined
  return lessons.find(l => l.number === current.number + 1)
}

/** Helper: get previous lesson */
export function getPreviousLesson(currentId: string): Lesson | undefined {
  const current = getLesson(currentId)
  if (!current) return undefined
  return lessons.find(l => l.number === current.number - 1)
}

/** Helper: get lessons by phase */
export function getLessonsByPhase(phaseId: string): Lesson[] {
  return lessons.filter(l => l.phase === phaseId)
}

/** Helper: get completed count per phase */
export function getPhaseProgress(completed: Set<string>) {
  return learningPhases.map(phase => {
    const phaseLessons = lessons.filter(l => l.phase === phase.id)
    const total = phaseLessons.length
    const completedCount = phaseLessons.filter(l => completed.has(l.id)).length
    return {
      phaseId: phase.id,
      phaseTitle: phase.title,
      phaseIcon: phase.icon,
      total,
      completed: completedCount,
      percent: total > 0 ? Math.round((completedCount / total) * 100) : 0
    }
  })
}

/** Helper: find lesson ID by feature ID */
export function getLessonIdForFeature(featureId: string): string | undefined {
  const lesson = lessons.find(l => l.featureId === featureId)
  return lesson?.id
}

/** Helper: get overall completion stats */
export function getOverallStats(completed: Set<string>) {
  const total = lessons.length
  const completedCount = completed.size
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0
  return { total, completedCount, percent }
}
