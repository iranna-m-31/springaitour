export type ParamKind = 'text' | 'textarea' | 'select' | 'number'

export interface ParamDef {
  name: string
  label: string
  defaultValue: string
  placeholder: string
  description: string
  /** Optional control kind. Defaults to 'text'. */
  kind?: ParamKind
  /** For kind: 'select', the list of option labels (submitted as their string value). */
  options?: string[]
  /** For kind: 'select', the corresponding submitted values. Defaults to options. */
  optionValues?: string[]
}

export interface ParamGroup {
  label: string
  endpoint: string
  paramNames: string[]
  description: string
}

export interface Feature {
  id: string
  number: number
  title: string
  description: string
  endpoint: string
  method: string
  params: ParamDef[]
  example: string
  responseHint?: string
  notes?: string
  concepts?: string[]
  requiresDocker?: boolean
  dockerOptional?: boolean
  requiresPaidKey?: boolean
  sourceFiles?: string[]
  /** Module this feature belongs to */
  module?: string
  /** Short summary for module cards */
  summary?: string
  /** Image path for this feature */
  image?: string
  /** Architecture diagram description */
  diagram?: {
    layers: Array<{ label: string; boxes: Array<{ text: string; type: 'app' | 'spring' | 'provider' }> }>
  }
  /** Split params into groups that call different endpoints (e.g. for embeddings) */
  paramGroups?: ParamGroup[]
}

export type ModuleId = 'foundations' | 'core' | 'advanced' | 'specialized'

export interface Module {
  id: ModuleId
  title: string
  description: string
  icon: string
  iconType: 'foundations' | 'core' | 'advanced' | 'specialized'
  features: string[]
  color: string
}

/** Learning Modules - organized progression for Spring AI developers */
export const modules: Module[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'Start here — the essential building blocks every Spring AI developer needs',
    icon: '🌱',
    iconType: 'foundations',
    color: '#3b82f6',
    features: ['plain-chat', 'system-prompts', 'prompt-templates', 'streaming', 'metadata'],
  },
  {
    id: 'core',
    title: 'Core Features',
    description: 'Production-ready patterns: structured output, memory, tools, and multimodal AI',
    icon: '⚙️',
    iconType: 'core',
    color: '#10b981',
    features: ['structured-output', 'multimodality', 'tool-calling', 'chat-memory', 'advisors'],
  },
  {
    id: 'advanced',
    title: 'Advanced Patterns',
    description: 'Embeddings, RAG, and vector stores for semantic search and knowledge retrieval',
    icon: '🧠',
    iconType: 'advanced',
    color: '#f59e0b',
    features: ['embeddings', 'rag', 'moderation'],
  },
  {
    id: 'specialized',
    title: 'Specialized Topics',
    description: 'MCP, observability, and evaluation — for production systems and team workflows',
    icon: '🚀',
    iconType: 'specialized',
    color: '#8b5cf6',
    features: ['mcp', 'observability', 'evaluation'],
  },
]

/** Feature Registry — all 16 features in learning order */
export const features: Feature[] = [
  {
    id: 'plain-chat',
    number: 1,
    module: 'foundations',
    title: 'Plain Chat',
    summary: 'The simplest chat endpoint — foundation for all Spring AI features',
    description:
      'The simplest chat endpoint. Send a user prompt and get the LLM\'s response as plain text. This is the foundation — every other feature builds on the same ChatClient.',
    endpoint: 'GET /ai',
    method: 'GET',
    params: [
      { name: 'userInput', label: 'User Input', defaultValue: 'Tell me a joke', placeholder: 'Enter your prompt', description: 'The message sent to the LLM' },
    ],
    example: 'curl "http://localhost:8080/ai?userInput=Tell%20me%20a%20joke"',
    responseHint: 'Plain text response from the LLM',
    concepts: ['ChatClient', 'prompt', 'generation'],
    sourceFiles: ['com/imm/springai/ChatController.java'],
    image: '/images/features/plain-chat.svg',
    diagram: {
      layers: [
        { label: 'Your App', boxes: [{ text: 'ChatClient', type: 'app' }] },
        { label: 'Spring AI', boxes: [{ text: 'ChatClient Builder', type: 'spring' }] },
        { label: 'Model', boxes: [{ text: 'OpenRouter / OpenAI', type: 'provider' }] },
      ],
    },
  },
  {
    id: 'system-prompts',
    number: 2,
    module: 'foundations',
    title: 'System Prompts',
    summary: 'Create reusable ChatClient personas with default system instructions',
    description:
      'ChatClient is immutable — you build it once with defaults and reuse it. You can have multiple ChatClient beans with different personas. The system prompt sets the behavior for every call.',
    endpoint: 'GET /ai/system  |  GET /ai/pirate',
    method: 'GET',
    params: [
      {
        name: 'persona',
        label: 'Persona',
        defaultValue: 'system',
        placeholder: '',
        description: 'Which ChatClient bean to use (each has a different system prompt).',
        kind: 'select',
        options: ['Tutor (default)', 'Pirate'],
        optionValues: ['system', 'pirate'],
      },
      { name: 'userInput', label: 'User Input', defaultValue: 'What is RAG', placeholder: 'Enter your prompt', description: 'The message sent to the LLM' },
    ],
    example: 'curl "http://localhost:8080/ai/system?userInput=What%20is%20RAG"\ncurl "http://localhost:8080/ai/pirate?userInput=What%20is%20RAG"',
    responseHint: 'Response in the persona of the configured ChatClient',
    concepts: ['ChatClient', 'defaultSystem', 'immutability'],
    sourceFiles: ['com/imm/springai/ChatClientConfig.java'],
    image: '/images/features/system-prompts.svg',
  },
  {
    id: 'prompt-templates',
    number: 3,
    module: 'foundations',
    title: 'Prompt Templates',
    summary: 'Separate prompt structure from runtime values using StringTemplate placeholders',
    description:
      'StringTemplate under the hood. Placeholders in {placeholder} are replaced at call time. This separates the prompt structure from the runtime values.',
    endpoint: 'GET /ai/template',
    method: 'GET',
    params: [
      { name: 'topic', label: 'Topic', defaultValue: 'embeddings', placeholder: 'e.g. embeddings', description: 'The topic to explain' },
      { name: 'level', label: 'Level', defaultValue: 'junior', placeholder: 'e.g. junior', description: 'Target audience experience level' },
    ],
    example: 'curl "http://localhost:8080/ai/template?topic=embeddings&level=junior"',
    responseHint: 'A 3-line explanation in the specified tone',
    concepts: ['StringTemplate', 'UserSpec', 'param'],
    sourceFiles: ['com/imm/springai/TutorController.java'],
    image: '/images/features/prompt-templates.svg',
  },
  {
    id: 'streaming',
    number: 4,
    module: 'foundations',
    title: 'Streaming Responses',
    summary: 'Stream tokens in real-time using WebFlux Flux for responsive UX',
    description:
      'Instead of waiting for the full response, the LLM streams tokens as they are generated. Uses WebFlux — returns a Flux<String>. Ideal for long responses where the user wants to see output immediately.',
    endpoint: 'GET /ai/stream',
    method: 'GET',
    params: [
      {
        name: 'userInput',
        label: 'User Input',
        defaultValue: 'Write a short poem about Java streams',
        placeholder: 'Enter your prompt',
        description: 'The message sent to the LLM. Tokens will appear in the response area as they are generated.',
        kind: 'textarea',
      },
    ],
    example: 'curl -N "http://localhost:8080/ai/stream?userInput=Write%20a%20short%20poem"',
    responseHint: 'Tokens streamed one at a time',
    concepts: ['WebFlux', 'Flux', 'streaming'],
    notes: 'Requires spring-boot-starter-webflux on the classpath',
    sourceFiles: ['com/imm/springai/TutorController.java'],
    image: '/images/features/streaming.svg',
  },
  {
    id: 'metadata',
    number: 5,
    module: 'foundations',
    title: 'ChatResponse Metadata',
    summary: 'Track token usage, model info, and costs with every LLM call',
    description:
      'Every LLM call returns metadata — model name, token usage (input, output, total). This is essential for cost tracking and debugging.',
    endpoint: 'GET /ai/meta',
    method: 'GET',
    params: [
      { name: 'userInput', label: 'User Input', defaultValue: 'Hello', placeholder: 'Enter your prompt', description: 'The message sent to the LLM' },
    ],
    example: 'curl "http://localhost:8080/ai/meta?userInput=Hello"',
    responseHint: 'JSON with model, inputTokens, outputTokens, totalTokens, content',
    concepts: ['ChatResponse', 'Generation', 'Usage'],
    sourceFiles: ['com/imm/springai/TutorController.java'],
    image: '/images/features/metadata.svg',
  },
  {
    id: 'structured-output',
    number: 6,
    module: 'core',
    title: 'Structured Output → POJO',
    summary: 'Map LLM output directly to Java records — no JSON parsing needed',
    description:
      'Map LLM output directly to a Java record. No JSON parsing code. Use .entity(Class) for single objects or ParameterizedTypeReference for lists. Reliability switches (validateSchema, useProviderStructuredOutput) handle flaky models.',
    endpoint: 'GET /ai/structured  |  /ai/structured/list  |  /ai/structured/strict',
    method: 'GET',
    params: [],
    example: 'curl "http://localhost:8080/ai/structured"\ncurl "http://localhost:8080/ai/structured/list"\ncurl "http://localhost:8080/ai/structured/strict"',
    responseHint: 'ActorFilms record with actor name and movie list',
    concepts: ['record', 'ParameterizedTypeReference', 'validateSchema'],
    sourceFiles: ['com/imm/springai/TutorController.java'],
    image: '/images/features/structured-output.svg',
  },
  {
    id: 'multimodality',
    number: 7,
    module: 'core',
    title: 'Multimodality (Image Input)',
    summary: 'Send images + text to vision-capable models for analysis',
    description:
      'Send text + an image to the LLM and get a description back. The model must support vision (GPT-4o, etc.). The image is embedded in the prompt as a Media object.',
    endpoint: 'GET /ai/image',
    method: 'GET',
    params: [],
    example: 'curl "http://localhost:8080/ai/image"',
    responseHint: 'Text description of the image',
    concepts: ['Media', 'MimeTypeUtils', 'vision'],
    notes: 'Note: Requires src/main/resources/multimodal.test.png — this prerequisite must be present before clicking Try It.',
    sourceFiles: ['com/imm/springai/TutorController.java'],
    image: '/images/features/multimodality.svg',
  },
  {
    id: 'tool-calling',
    number: 8,
    module: 'core',
    title: 'Tool Calling',
    summary: 'Expose Java methods to the LLM — it decides when to call them',
    description:
      'Expose Java methods to the model. The model decides when to call them. @Tool annotation marks a method as callable, @ToolParam provides parameter hints. ToolCallingAdvisor runs the tool loop automatically.',
    endpoint: 'GET /ai/tool/time  |  GET /ai/tool/arithmetic',
    method: 'GET',
    params: [],
    example: 'curl "http://localhost:8080/ai/tool/time"\ncurl "http://localhost:8080/ai/tool/arithmetic"',
    responseHint: 'Current time or arithmetic result',
    concepts: ['@Tool', '@ToolParam', 'ToolCallingAdvisor'],
    sourceFiles: ['com/imm/springai/DateTimeTools.java', 'com/imm/springai/ToolController.java'],
    image: '/images/features/tool-calling.svg',
  },
  {
    id: 'chat-memory',
    number: 9,
    module: 'core',
    title: 'Chat Memory',
    summary: 'Make the model remember conversations across turns',
    description:
      'The model forgets each call by default. ChatMemory makes it remember across turns. Use conversationId to scope conversations. In production, swap InMemoryChatMemoryRepository for JdbcChatMemoryRepository.',
    endpoint: 'GET /ai/chat  |  GET /ai/chat/messages  |  GET /ai/chat/clear',
    method: 'GET',
    params: [
      { name: 'conversationId', label: 'Conversation ID', defaultValue: '', placeholder: 'Auto-generated on load', description: 'Unique conversation identifier (auto-generated)' },
      {
        name: 'userInput',
        label: 'Step 1: Tell the model a fact',
        defaultValue: 'My name is Iranna.',
        placeholder: 'Enter a fact for the model to remember',
        description: 'First message - state a fact the model should remember',
        kind: 'textarea',
      },
      {
        name: 'followUp',
        label: 'Step 2: Ask a follow-up question',
        defaultValue: 'What is my name?',
        placeholder: 'Ask a question testing recall',
        description: 'Second message - test if the model remembers',
        kind: 'textarea',
      },
    ],
    example: 'curl "http://localhost:8080/ai/chat?conversationId=demo-1&userInput=My%20name%20is%20Iranna"\ncurl "http://localhost:8080/ai/chat?conversationId=demo-1&userInput=What%20is%20my%20name%3F"',
    responseHint: 'Response text, or list of stored messages',
    concepts: ['ChatMemory', 'CONVERSATION_ID', 'message history'],
    sourceFiles: ['com/imm/springai/MemoryConfig.java', 'com/imm/springai/MemoryController.java'],
    image: '/images/features/chat-memory.svg',
  },
  {
    id: 'advisors',
    number: 10,
    module: 'core',
    title: 'Advisors API',
    summary: 'Cross-cutting concerns: logging, memory, RAG, safety — compose like middleware',
    description:
      'Advisors wrap the chat call — cross-cutting concerns like logging, memory, RAG, tool calling, safety. SimpleLoggerAdvisor logs every request/response. Order matters: HIGHEST_PRECEDENCE runs first on request, last on response (like a stack).',
    endpoint: 'Configuration-based (no direct endpoint)',
    method: 'N/A',
    params: [],
    example: '// Advisors are configured in ChatClientConfig.java\n// curl "http://localhost:8080/ai" — logging is automatic',
    responseHint: 'Same as plain chat, but with advisor logging in console',
    concepts: ['Advisor', 'SimpleLoggerAdvisor', 'ordering'],
    sourceFiles: ['com/imm/springai/ChatClientConfig.java'],
    image: '/images/features/advisors.svg',
  },
  {
    id: 'embeddings',
    number: 11,
    module: 'advanced',
    title: 'Embeddings',
    summary: 'Turn text into vectors for similarity, search, and RAG',
    description:
      'Turn text into a vector of floats. Similar meaning → similar vectors. Used for semantic search, RAG, recommendation engines. The demo shows single embedding, batch embedding, and cosine similarity. The /embed/faq endpoint demonstrates a real-world use case: semantic FAQ search where matching is by meaning, not keywords.',
    endpoint: 'GET /ai/embed  |  /ai/embed/batch  |  /ai/embed/similarity  |  /ai/embed/faq',
    method: 'GET',
    params: [
      { name: 'text', label: 'Text', defaultValue: 'Spring AI', placeholder: 'Text to embed', description: 'Single text to embed' },
      { name: 'a', label: 'Text A', defaultValue: 'Spring', placeholder: 'First text', description: 'First text for similarity' },
      { name: 'b', label: 'Text B', defaultValue: 'AI', placeholder: 'Second text', description: 'Second text for similarity' },
      { name: 'q', label: 'Query', defaultValue: 'How does search work', placeholder: 'Search query', description: 'Query for semantic FAQ search' },
    ],
    paramGroups: [
      { label: 'Single embedding', endpoint: '/ai/embed', paramNames: ['text'], description: 'Call /ai/embed with a single text value' },
      { label: 'Similarity comparison', endpoint: '/ai/embed/similarity', paramNames: ['a', 'b'], description: 'Call /ai/embed/similarity with Text A and Text B' },
      { label: 'Semantic FAQ search', endpoint: '/ai/embed/faq', paramNames: ['q'], description: 'Call /ai/embed/faq with a query to find semantically similar FAQ entries' },
    ],
    example: 'curl "http://localhost:8080/ai/embed?text=Spring%20AI"\ncurl "http://localhost:8080/ai/embed/similarity?a=cat&b=dog"\ncurl "http://localhost:8080/ai/embed/faq?q=How%20does%20search%20work"',
    responseHint: 'float[] vector, batch metadata, cosine similarity score, or FAQ search results',
    concepts: ['EmbeddingModel', '.embed()', 'cosineSimilarity', 'SimpleVectorStore'],
    sourceFiles: ['com/imm/springai/EmbeddingController.java'],
    image: '/images/features/embeddings.svg',
  },
  {
    id: 'rag',
    number: 12,
    module: 'advanced',
    title: 'Vector Store + RAG',
    summary: 'Retrieval-Augmented Generation: fetch docs, augment prompts, generate answers',
    description:
      'RAG (Retrieval Augmented Generation) fetches relevant documents and feeds them into the LLM prompt. The flow: DocumentReader → TokenTextSplitter → VectorStore.write → similaritySearch → prompt augmentation. SimpleVectorStore is in-memory only (good for demos, not production). Swap to Qdrant or PGVector for production.',
    endpoint: 'GET /ai/rag  |  GET /ai/rag/filtered  |  GET /ai/rag/debug',
    method: 'GET',
    params: [
      { name: 'q', label: 'Query', defaultValue: 'What is RAG', placeholder: 'Search query', description: 'Question to search documents for' },
      { name: 'threshold', label: 'Threshold', defaultValue: '0.7', placeholder: 'e.g. 0.7', description: 'Minimum similarity score (for filtered endpoint)' },
    ],
    paramGroups: [
      { label: 'Basic RAG', endpoint: '/ai/rag', paramNames: ['q'], description: 'Call /ai/rag to get an answer based on top-3 retrieved documents' },
      { label: 'Filtered RAG', endpoint: '/ai/rag/filtered', paramNames: ['q', 'threshold'], description: 'Call /ai/rag/filtered with a similarity threshold filter' },
      { label: 'Debug', endpoint: '/ai/rag/debug', paramNames: ['q'], description: 'Call /ai/rag/debug to see which documents would be retrieved' },
    ],
    example: 'curl "http://localhost:8080/ai/rag?q=What%20is%20RAG"\ncurl "http://localhost:8080/ai/rag/filtered?q=embeddings&threshold=0.7"\ncurl "http://localhost:8080/ai/rag/debug?q=Spring%20AI"',
    responseHint: 'Answer based on retrieved context, or document debug info',
    concepts: ['DocumentReader', 'TokenTextSplitter', 'VectorStore', 'similaritySearch', 'Qdrant', 'PGVector'],
    dockerOptional: true,
    sourceFiles: ['com/imm/springai/RagConfig.java', 'com/imm/springai/RagController.java'],
    image: '/images/features/rag.svg',
    diagram: {
      layers: [
        { label: 'Ingest', boxes: [{ text: 'DocumentReader', type: 'spring' }, { text: 'TokenTextSplitter', type: 'spring' }] },
        { label: 'Store', boxes: [{ text: 'VectorStore', type: 'spring' }] },
        { label: 'Retrieve', boxes: [{ text: 'similaritySearch', type: 'spring' }] },
        { label: 'Generate', boxes: [{ text: 'ChatClient + Context', type: 'app' }] },
      ],
    },
  },
  {
    id: 'moderation',
    number: 13,
    module: 'advanced',
    title: 'Moderation',
    summary: 'Detect unsafe content using moderation models',
    description:
      'Detect unsafe/harmful content using a ModerationModel. Most providers ship moderation models, but OpenRouter\'s free tier may not support it — this endpoint gracefully returns a "not available" message instead of crashing.',
    endpoint: 'GET /ai/moderation',
    method: 'GET',
    params: [
      { name: 'text', label: 'Text', defaultValue: 'This is a test', placeholder: 'Text to moderate', description: 'Text to check for harmful content' },
    ],
    example: 'curl "http://localhost:8080/ai/moderation?text=This%20is%20a%20test"',
    responseHint: 'flagged boolean, categories, categoryScores, or note about unavailability',
    concepts: ['ModerationModel', 'ModerationPrompt', 'ModerationResult'],
    requiresPaidKey: true,
    sourceFiles: ['com/imm/springai/ModerationController.java'],
    image: '/images/features/moderation.svg',
  },
  {
    id: 'mcp',
    number: 14,
    module: 'specialized',
    title: 'Model Context Protocol (MCP)',
    summary: 'Standard protocol for connecting LLMs to external tool servers',
    description:
      'MCP is the "USB-C for tools" — a standard for connecting LLMs to external tool servers. Spring AI has client and server starters. This is configuration-based, no direct endpoint — see McpConfig.java for the setup.',
    endpoint: 'Configuration-based (no direct endpoint)',
    method: 'N/A',
    params: [],
    example: '// Add spring-ai-starter-mcp-server dependency\n// Uncomment McpConfig.java\n// curl "http://localhost:8080" — MCP server starts',
    responseHint: 'MCP server exposed via stdio / SSE / streamable-HTTP',
    concepts: ['MCP', 'spring-ai-starter-mcp', 'stdio'],
    sourceFiles: ['com/imm/springai/McpConfig.java'],
    image: '/images/features/mcp.svg',
  },
  {
    id: 'observability',
    number: 15,
    module: 'specialized',
    title: 'Observability',
    summary: 'Micrometer + OpenTelemetry tracing for AI operations',
    description:
      'Add Micrometer tracing with OpenTelemetry bridge. Spring AI auto-instruments ChatModel calls, advisor chains, tool executions, and vector store queries. Expose actuator endpoints for health, metrics, and custom Spring AI metrics.',
    endpoint: 'GET /actuator/health  |  /actuator/metrics  |  /actuator/ai-metrics',
    method: 'GET',
    params: [],
    example: 'curl "http://localhost:8080/actuator/health"\ncurl "http://localhost:8080/actuator/metrics"\ncurl "http://localhost:8080/actuator/ai-metrics"',
    responseHint: 'Health status, metrics list, or AI metrics summary',
    concepts: ['Micrometer', 'OpenTelemetry', 'actuator'],
    sourceFiles: ['com/imm/springai/ObservabilityConfig.java'],
    image: '/images/features/observability.svg',
  },
  {
    id: 'evaluation',
    number: 16,
    module: 'specialized',
    title: 'Model Evaluation / Testing',
    summary: 'LLM-as-a-Judge: evaluate answers for relevancy and factual accuracy',
    description:
      'Spring AI 2.0 replaced dedicated Evaluator classes with "LLM-as-a-Judge" — ask a second prompt to evaluate the first answer. Two judges: relevancy (does the answer address the question?) and fact-check (is the answer supported by the context?). For unit tests, mock ChatModel directly.',
    endpoint: 'GET /ai/eval/relevancy  |  GET /ai/eval/factcheck',
    method: 'GET',
    params: [
      { name: 'question', label: 'Question', defaultValue: 'What is Java', placeholder: 'The question', description: 'Question being evaluated' },
      { name: 'answer', label: 'Answer', defaultValue: 'Java is a programming language', placeholder: 'The answer to evaluate', description: 'Answer to check' },
      { name: 'context', label: 'Context', defaultValue: 'Spring AI is a framework', placeholder: 'Context for fact-check', description: 'Reference context (for factcheck)' },
    ],
    example: 'curl "http://localhost:8080/ai/eval/relevancy?question=What%20is%20Java&answer=Java%20is%20a%20programming%20language"\ncurl "http://localhost:8080/ai/eval/factcheck?context=Spring%20AI%20is%20a%20framework&answer=Spring%20AI%20is%20a%20framework"',
    responseHint: 'PASS/FAIL verdict with one-sentence reason',
    concepts: ['LLM-as-a-Judge', 'PASS/FAIL', 'mock(ChatModel)'],
    sourceFiles: ['com/imm/springai/EvalController.java'],
    image: '/images/features/evaluation.svg',
  },
] as const

/** Helper to get features by module */
export function getFeaturesByModule(moduleId: ModuleId): Feature[] {
  const module = modules.find(m => m.id === moduleId)
  if (!module) return []
  return module.features.map(fid => features.find(f => f.id === fid)!).filter(Boolean)
}

/** Helper to get module for a feature */
export function getModuleForFeature(featureId: string): Module | undefined {
  return modules.find(m => m.features.includes(featureId))
}

/** Get next feature in learning order */
export function getNextFeature(currentId: string): Feature | null {
  const currentIndex = features.findIndex(f => f.id === currentId)
  if (currentIndex === -1 || currentIndex === features.length - 1) return null
  return features[currentIndex + 1]
}

/** Get previous feature in learning order */
export function getPreviousFeature(currentId: string): Feature | null {
  const currentIndex = features.findIndex(f => f.id === currentId)
  if (currentIndex <= 0) return null
  return features[currentIndex - 1]
}