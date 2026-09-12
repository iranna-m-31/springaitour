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
  /** Code diff view: Before Spring AI vs With Spring AI */
  codeDiff?: {
    before: string
    after: string
    beforeTitle?: string
    afterTitle?: string
  }
  /** Architecture explanation (markdown) */
  architecture?: string
  /** Checkpoint question at the end of the lesson */
  checkpoint?: {
    type: 'multiple-choice' | 'predict-output' | 'fix-code' | 'fill-blank'
    question: string
    options?: string[]
    answer: string | string[]
    explanation: string
  }
  /** Split params into groups that call different endpoints (e.g. embeddings) */
  paramGroups?: ParamGroup[]
  /** Difficulty level for the feature */
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  /** Estimated time in minutes */
  estimatedTime?: number
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
  /** Difficulty level for this module */
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  /** Estimated time in minutes for the module */
  estimatedTime?: number
  /** Difficulty color class */
  difficultyColor?: string
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
    difficulty: 'beginner',
    estimatedTime: 45,
    difficultyColor: 'badge-beginner',
  },
  {
    id: 'core',
    title: 'Core Features',
    description: 'Production-ready patterns: structured output, memory, tools, and multimodal AI',
    icon: '⚙️',
    iconType: 'core',
    color: '#10b981',
    features: ['structured-output', 'multimodality', 'tool-calling', 'chat-memory', 'advisors'],
    difficulty: 'intermediate',
    estimatedTime: 60,
    difficultyColor: 'badge-intermediate',
  },
  {
    id: 'advanced',
    title: 'Advanced Patterns',
    description: 'Embeddings, RAG, and vector stores for semantic search and knowledge retrieval',
    icon: '🧠',
    iconType: 'advanced',
    color: '#f59e0b',
    features: ['embeddings', 'rag', 'moderation'],
    difficulty: 'advanced',
    estimatedTime: 75,
    difficultyColor: 'badge-advanced',
  },
  {
    id: 'specialized',
    title: 'Specialized Topics',
    description: 'MCP, observability, and evaluation — for production systems and team workflows',
    icon: '🚀',
    iconType: 'specialized',
    color: '#8b5cf6',
    features: ['mcp', 'observability', 'evaluation'],
    difficulty: 'expert',
    estimatedTime: 60,
    difficultyColor: 'badge-expert',
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
    difficulty: 'beginner',
    estimatedTime: 5,
    params: [
      { name: 'userInput', label: 'User Input', defaultValue: 'Tell me a joke', placeholder: 'Enter your prompt', description: 'The message sent to the LLM' },
    ],
    example: 'curl "http://localhost:8080/ai?userInput=Tell%20me%20a%20joke"',
    responseHint: 'Plain text response from the LLM',
    concepts: ['ChatClient', 'prompt', 'generation'],
    sourceFiles: ['com/imm/springai/ChatController.java'],
    codeDiff: {
      before: "RestTemplate restTemplate = new RestTemplate();\nHttpHeaders headers = new HttpHeaders();\nheaders.setContentType(MediaType.APPLICATION_JSON);\n\nMap<String, Object> requestBody = new HashMap<>();\nrequestBody.put(\"model\", \"gpt-3.5-turbo\");\nrequestBody.put(\"messages\", List.of(\n    Map.of(\"role\", \"user\", \"content\", \"Tell me a joke\")\n));\n\nHttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);\nResponseEntity<String> response = restTemplate.exchange(\n    \"https://api.openai.com/v1/chat/completions\",\n    HttpMethod.POST,\n    request,\n    String.class\n);\n\nString joke = response.getBody();\n// Parse JSON to extract the joke from the response\n",
      after: "@RestController\nclass ChatController {\n    private final ChatClient chatClient;\n    \n    public ChatController(ChatClient.Builder chatClientBuilder) {\n        this.chatClient = chatClientBuilder.build();\n    }\n    \n    @GetMapping(\"/ai\")\n    String generation(String userInput) {\n        return this.chatClient.prompt()\n            .user(userInput)\n            .call()\n            .content();\n    }\n}",
      beforeTitle: "Before Spring AI (Manual HTTP)",
      afterTitle: "With Spring AI ChatClient"
    },
    architecture: "### Plain Chat Flow\n\nYour browser sends a prompt to `/ai` → ChatClient receives it → Spring AI calls the configured LLM provider (OpenRouter) → response comes back as plain text.\n\n**Flow:**\n- **User** → `GET /ai?userInput=...` → **ChatClient** → **LLM Provider** → response\n\nSee [Spring AI ChatClient docs](https://docs.spring.io/spring-ai/reference/api/chatclient.html) for details.",
    checkpoint: {
      type: 'multiple-choice',
      question: 'What is the main advantage of using ChatClient over manual HTTP calls?',
      options: [
        'Better performance',
        'Automatic JSON serialization/deserialization',
        'Portable API that works with multiple LLM providers',
        'Built-in caching'
      ],
      answer: 'Portable API that works with multiple LLM providers',
      explanation: 'ChatClient provides a portable abstraction layer so your code works the same way regardless of which LLM provider you use (OpenAI, Anthropic, Azure, etc.).'
    }
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
difficulty: 'beginner',
    estimatedTime: 10,    params: [
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
    codeDiff: {
      before: "// Without Spring AI: Each request needs manual system message\nMap<String, Object> requestBody = new HashMap<>();\nrequestBody.put(\"model\", \"gpt-3.5-turbo\");\nrequestBody.put(\"messages\", List.of(\n    Map.of(\"role\", \"system\", \"content\", \"You are a helpful tutor.\"),\n    Map.of(\"role\", \"user\", \"content\", \"What is RAG?\")\n));\n\n// For a pirate persona, you'd need separate code:\nMap<String, Object> pirateBody = new HashMap<>();\npirateBody.put(\"model\", \"gpt-3.5-turbo\");\npirateBody.put(\"messages\", List.of(\n    Map.of(\"role\", \"system\", \"content\", \"You are a pirate. Speak like one.\"),\n    Map.of(\"role\", \"user\", \"content\", \"What is RAG?\")\n));\n",
      after: "@Configuration\nclass ChatClientConfig {\n    @Bean\n    ChatClient tutorChatClient(ChatClient.Builder builder) {\n        return builder\n            .defaultSystem(\"You are a helpful tutor.\")\n            .build();\n    }\n    \n    @Bean\n    ChatClient pirateChatClient(ChatClient.Builder builder) {\n        return builder\n            .defaultSystem(\"You are a pirate. Speak like one.\")\n            .build();\n    }\n}\n\n// Usage:\ntutor.prompt().user(\"What is RAG?\").call().content();\npirate.prompt().user(\"What is RAG?\").call().content();",
      beforeTitle: "Before Spring AI (Manual System Messages)",
      afterTitle: "With Spring AI ChatClient"
    },
    architecture: "### System Prompts Flow\n\nUser selects a persona → ChatClient bean (built with defaultSystem) receives the prompt → Spring AI merges the system prompt with the user message → LLM provider generates response.\n\n**Flow:**\n- **User** → Select Persona + Prompt → **ChatClient Bean** → **LLM Provider** → Response\n\nSee [Spring AI System Prompts](https://docs.spring.io/spring-ai/reference/api/chatclient.html#_system_prompts) for details.",
    checkpoint: {
      type: 'multiple-choice',
      question: 'Why are ChatClient beans considered immutable?',
      options: [
        'They cannot be modified after creation',
        'They are final classes',
        'They are singletons by default',
        'They use record types'
      ],
      answer: 'They cannot be modified after creation',
      explanation: 'ChatClient is built with a fluent builder pattern. Once .build() is called, the ChatClient instance is immutable — you cannot change its default system prompt, advisors, or options. To change behavior, you create a new ChatClient bean.'
    }
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
difficulty: 'beginner',
    estimatedTime: 10,    params: [
      { name: 'topic', label: 'Topic', defaultValue: 'embeddings', placeholder: 'e.g. embeddings', description: 'The topic to explain' },
      { name: 'level', label: 'Level', defaultValue: 'junior', placeholder: 'e.g. junior', description: 'Target audience experience level' },
    ],
    example: 'curl "http://localhost:8080/ai/template?topic=embeddings&level=junior"',
    responseHint: 'A 3-line explanation in the specified tone',
    concepts: ['StringTemplate', 'UserSpec', 'param'],
    sourceFiles: ['com/imm/springai/TutorController.java'],
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
difficulty: 'intermediate',
    estimatedTime: 15,    params: [
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
    architecture: "### Streaming Flow\n\nUser requests a streamed response → ChatClient calls `.prompt().stream()` returning a `Flux<String>` → LLM yields tokens as they are generated → ChatClient streams tokens to the user in real-time via WebFlux.\n\n**Flow:**\n- **User** → Stream Request → **ChatClient** → **LLM** → Streaming Tokens → Streaming Response\n\nSee [Spring AI Streaming](https://docs.spring.io/spring-ai/reference/api/chatclient.html#_streaming) for details.",
    checkpoint: {
      type: 'multiple-choice',
      question: 'Why is streaming useful for long LLM responses?',
      options: [
        'It reduces the total response time',
        'It allows the user to see output immediately instead of waiting for the full response',
        'It reduces memory usage on the server',
        'It enables compression of the response'
      ],
      answer: 'It allows the user to see output immediately instead of waiting for the full response',
      explanation: 'With streaming, tokens are sent from the LLM to the user as soon as they are generated, providing immediate feedback rather than making the user wait for the entire response to be generated.'
    }
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
difficulty: 'beginner',
    estimatedTime: 8,    params: [
      { name: 'userInput', label: 'User Input', defaultValue: 'Hello', placeholder: 'Enter your prompt', description: 'The message sent to the LLM' },
    ],
    example: 'curl "http://localhost:8080/ai/meta?userInput=Hello"',
    responseHint: 'JSON with model, inputTokens, outputTokens, totalTokens, content',
    concepts: ['ChatResponse', 'Generation', 'Usage'],
    sourceFiles: ['com/imm/springai/TutorController.java'],
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
difficulty: 'intermediate',
    estimatedTime: 20,    params: [],
    example: 'curl "http://localhost:8080/ai/structured"\ncurl "http://localhost:8080/ai/structured/list"\ncurl "http://localhost:8080/ai/structured/strict"',
    responseHint: 'ActorFilms record with actor name and movie list',
    concepts: ['record', 'ParameterizedTypeReference', 'validateSchema'],
    sourceFiles: ['com/imm/springai/TutorController.java'],
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
difficulty: 'intermediate',
    estimatedTime: 15,    params: [
      { name: 'prompt', label: 'Prompt', defaultValue: 'Describe this image', placeholder: 'e.g. Describe this image', description: 'Question about the image' },
    ],
    example: 'curl "http://localhost:8080/ai/image?prompt=Describe%20this%20image"',
    responseHint: 'Text description of the image',
    concepts: ['Media', 'MimeTypeUtils', 'vision'],
    notes: 'Note: Requires src/main/resources/multimodal.test.png — this prerequisite must be present before clicking Try It. The image is pre-loaded on the server side.',
    sourceFiles: ['com/imm/springai/TutorController.java'],
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
difficulty: 'advanced',
    estimatedTime: 25,    params: [],
    example: 'curl "http://localhost:8080/ai/tool/time"\ncurl "http://localhost:8080/ai/tool/arithmetic"',
    responseHint: 'Current time or arithmetic result',
    concepts: ['@Tool', '@ToolParam', 'ToolCallingAdvisor'],
    sourceFiles: ['com/imm/springai/DateTimeTools.java', 'com/imm/springai/ToolController.java'],
    architecture: "### Tool Calling Flow\n\nUser asks a question requiring a tool → ChatClient (owns ToolCallingAdvisor loop) → LLM decides when a tool is needed → Tool Registry (@Tool methods) → Java Method executes business logic → Result returned to LLM → LLM formulates final answer.\n\n**Flow:**\n- **User** → Question → **ChatClient** → **LLM** (Prompt + Tools) → **Tool Registry** → **Java Method** → Result → Tool Result → **LLM** → Final Answer → **User**\n\nSee [Spring AI Tool Calling](https://docs.spring.io/spring-ai/reference/api/chatclient.html#_tool_calling) for details.",
    codeDiff: {
      before: "// Without Spring AI: Manual tool calling logic\nMap<String, Object> requestBody = new HashMap<>();\nrequestBody.put(\"model\", \"gpt-4\");\nrequestBody.put(\"messages\", List.of(\n    Map.of(\"role\", \"user\", \"content\", \"What time is it?\")\n));\n// Define tools manually\nList<Map<String, Object>> tools = List.of(\n    Map.of(\n        \"type\", \"function\",\n        \"function\", Map.of(\n            \"name\", \"getCurrentTime\",\n            \"description\", \"Get the current time\",\n            \"parameters\", Map.of(\"type\", \"object\", \"properties\", new HashMap<>())\n        )\n    )\n);\nrequestBody.put(\"tools\", tools);\n// ... send request, parse tool call, execute Java method, send result back...\n",
      after: "// With Spring AI: @Tool annotation does the heavy lifting\n@Tool(description = \"Get the current time\")\npublic String getCurrentTime() {\n    return LocalDateTime.now().toString();\n}\n\n// Register with ChatClient\nChatClient client = ChatClient.builder(chatModel)\n    .defaultTools(new DateTimeTools())\n    .build();\n\nString response = client.prompt()\n    .user(\"What time is it?\")\n    .call()\n    .content();\n// Spring AI handles the tool loop automatically\n",
      beforeTitle: "Before Spring AI (Manual Tool Calling)",
      afterTitle: "With Spring AI @Tool"
    },
    checkpoint: {
      type: 'multiple-choice',
      question: 'What happens when the LLM decides to call a tool?',
      options: [
        'The tool is executed and the result is sent back to the LLM for the final response',
        'The tool result is returned directly to the user',
        'The LLM stops and waits for user confirmation',
        'The tool is called but the result is ignored'
      ],
      answer: 'The tool is executed and the result is sent back to the LLM for the final response',
      explanation: 'Tool calling is a loop: LLM requests a tool call → your Java method executes → result goes back to LLM → LLM formulates final response. This happens automatically with ToolCallingAdvisor.'
    }
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
difficulty: 'intermediate',
    estimatedTime: 15,    params: [
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
    architecture: "### Chat Memory Flow\n\nUser sends a message → ChatClient auto-attaches ChatMemory → retrieves conversation history → LLM receives full context + new message → generates response → ChatClient stores the new message in memory → response sent to user.\n\n**Flow:**\n- **User** → Message → **ChatClient** → **ChatMemory** (Get History) → **LLM** (Context + New Message) → Response → **ChatClient** (Store New) → **User**\n\nSee [Spring AI Chat Memory](https://docs.spring.io/spring-ai/reference/api/chatclient.html#_chat_memory) for details.",
    checkpoint: {
      type: 'fill-blank',
      question: 'ChatMemory makes the model remember across turns. What parameter is used to scope conversations?',
      answer: 'conversationId',
      explanation: 'The conversationId parameter uniquely identifies a conversation. All messages with the same conversationId are stored together, allowing the model to "remember" the context across multiple turns.'
    }
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
difficulty: 'advanced',
    estimatedTime: 20,    params: [],
    example: '// Advisors are configured in ChatClientConfig.java\n// curl "http://localhost:8080/ai" — logging is automatic',
    responseHint: 'Same as plain chat, but with advisor logging in console',
    concepts: ['Advisor', 'SimpleLoggerAdvisor', 'ordering'],
    sourceFiles: ['com/imm/springai/ChatClientConfig.java'],
    architecture: "### Advisors Flow\n\nUser sends a request → ChatClient applies the advisor chain (HIGHEST_PRECEDENCE first on request, last on response) → advisors (logging, memory, RAG, etc.) run before/after the model call → ChatModel executes the LLM request → response flows back through the advisor chain to the user.\n\n**Flow:**\n- **User** → Request → **ChatClient** → **Advisor 1** → **Advisor N** → **ChatModel** → **LLM** → Response → **ChatClient** → **User**\n\nSee [Spring AI Advisors](https://docs.spring.io/spring-ai/reference/api/chatclient.html#_advisors) for details.",
    checkpoint: {
      type: 'multiple-choice',
      question: 'How are Advisors ordered in Spring AI?',
      options: [
        'Like a stack - HIGHEST_PRECEDENCE runs first on request, last on response',
        'Alphabetically by advisor name',
        'In the order they are added to the bean',
        'Randomly for each request'
      ],
      answer: 'Like a stack - HIGHEST_PRECEDENCE runs first on request, last on response',
      explanation: 'Advisors wrap the chat call like middleware. The advisor with HIGHEST_PRECEDENCE runs first on the request (top of stack) and last on the response (bottom of stack), similar to Servlet Filters.'
    }
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
difficulty: 'advanced',
    estimatedTime: 25,    params: [
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
    architecture: "### Embeddings Flow\n\nUser provides text → Embedding Model converts text to a vector → Vector Store stores the vector → Similarity Search finds documents with vectors closest to the query vector → results returned to the user.\n\n**Flow:**\n- **User** → Text → **Embedding Model** → Vector → **Vector Store** → **Similarity Search** → Similar Results\n\nSee [Spring AI Embeddings](https://docs.spring.io/spring-ai/reference/api/embedding.html) for details.",
    checkpoint: {
      type: 'multiple-choice',
      question: 'What does an embedding represent?',
      options: [
        'A Java byte array',
        'A vector of numbers that captures semantic meaning',
        'A compressed text string',
        'A hash of the input text'
      ],
      answer: 'A vector of numbers that captures semantic meaning',
      explanation: 'An embedding converts text into a vector of floats where similar meanings have similar vectors. This is why we can do semantic search - not keyword matching, but meaning matching.'
    }
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
difficulty: 'advanced',
    estimatedTime: 30,    params: [
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
    architecture: "### RAG Flow\n\nUser asks a question → Embedding Model converts the query to a vector → Vector Store holds document embeddings → Retriever finds top-k similar document chunks → ChatClient augments the prompt with retrieved docs → LLM generates a grounded answer → response sent to the user.\n\n**Flow:**\n- **User** → Question → **Embedding Model** → Vector → **Vector Store** → **Retriever** → Relevant Docs → **ChatClient** (Augmented Prompt) → **LLM** → Answer → **User**\n\nSee [Spring AI RAG](https://docs.spring.io/spring-ai/reference/getting-started.html#_rag_retrieval_augmented_generation) for details.",
    codeDiff: {
      before: "// Without RAG: The LLM has no access to your documents\nChatClient client = ChatClient.builder(chatModel).build();\nString answer = client.prompt()\n    .user(\"What is RAG?\")\n    .call()\n    .content();\n// The model only knows what it was trained on\n",
      after: "// With RAG: The LLM gets relevant documents\nChatClient client = ChatClient.builder(chatModel)\n    .defaultAdvisors(\n        new QuestionAnswerAdvisor(retriever))\n    .build();\n\nString answer = client.prompt()\n    .user(\"What is RAG?\")\n    .call()\n    .content();\n// The model gets context from your documents\n",
      beforeTitle: "Before RAG",
      afterTitle: "With RAG"
    },
    checkpoint: {
      type: 'predict-output',
      question: 'What would happen if you call the RAG endpoint with a query that has no matching documents?',
      options: ['An error is thrown', 'The LLM responds based on its training data', 'The response says "No documents found"', 'The vector store creates new documents'],
      answer: 'The LLM responds based on its training data',
      explanation: 'When no relevant documents are found, the retriever returns an empty list. The LLM still responds based on its training data, but the answer may not be grounded in your documents. This is why RAG is most effective when your question has relevant context.'
    }
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
difficulty: 'intermediate',
    estimatedTime: 15,    params: [
      { name: 'text', label: 'Text', defaultValue: 'This is a test', placeholder: 'Text to moderate', description: 'Text to check for harmful content' },
    ],
    example: 'curl "http://localhost:8080/ai/moderation?text=This%20is%20a%20test"',
    responseHint: 'flagged boolean, categories, categoryScores, or note about unavailability',
    concepts: ['ModerationModel', 'ModerationPrompt', 'ModerationResult'],
    requiresPaidKey: true,
    sourceFiles: ['com/imm/springai/ModerationController.java'],
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
difficulty: 'advanced',
    estimatedTime: 20,    params: [],
    example: '// Add spring-ai-starter-mcp-server dependency\n// Uncomment McpConfig.java\n// curl "http://localhost:8080" — MCP server starts',
    responseHint: 'MCP server exposed via stdio / SSE / streamable-HTTP',
    concepts: ['MCP', 'spring-ai-starter-mcp', 'stdio'],
    sourceFiles: ['com/imm/springai/McpConfig.java'],
    architecture: "### MCP Flow\n\nUser interacts with MCP tools → MCP Client (Spring AI) integrates MCP servers → LLM decides when and which MCP tool to invoke → STDIO/SSE transport layer handles MCP communication → Tool result flows back through MCP Client → response sent to user.\n\n**Flow:**\n- **User** → Request → **MCP Client** → **LLM** (Tool Call Decision) → **STDIO/SSE** (Tool Execution) → Tool Result → **MCP Client** → **User**\n\nSee [Spring AI MCP](https://docs.spring.io/spring-ai/reference/other-mcp.html) for details.",
    checkpoint: {
      type: 'multiple-choice',
      question: 'What is MCP often called in the industry?',
      options: ['The "USB-C for tools"', 'The "HTTP for AI"', 'The "JDBC for LLMs"', 'The "REST for agents"'],
      answer: 'The "USB-C for tools"',
      explanation: 'MCP (Model Context Protocol) is described as the "USB-C for tools" — a standard, universal connector that lets any LLM talk to any tool server, regardless of provider, much like USB-C works with any device.'
    }
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
difficulty: 'advanced',
    estimatedTime: 20,    params: [],
    example: 'curl "http://localhost:8080/actuator/health"\ncurl "http://localhost:8080/actuator/metrics"\ncurl "http://localhost:8080/actuator/ai-metrics"',
    responseHint: 'Health status, metrics list, or AI metrics summary',
    concepts: ['Micrometer', 'OpenTelemetry', 'actuator'],
    sourceFiles: ['com/imm/springai/ObservabilityConfig.java'],
    architecture: "### Observability Flow\n\nApplication makes API calls → ChatModel executes LLM calls (auto-instrumented by Spring AI) → Micrometer collects metrics and tracing spans → OpenTelemetry exports distributed traces for debugging → Actuator exposes health, metrics, and AI metrics endpoints → status/metrics returned to the user.\n\n**Flow:**\n- **Application** → AI Call → **ChatModel** → Span → **Micrometer** → Metrics → **Actuator** → Status/Metrics → **User**\n\nSee [Spring AI Observability](https://docs.spring.io/spring-ai/reference/observability.html) for details.",
    checkpoint: {
      type: 'multiple-choice',
      question: 'What does OpenTelemetry provide for Spring AI?',
      options: ['Health checks only', 'Tracing and metrics instrumentation', 'Database connection pooling', 'Security filtering'],
      answer: 'Tracing and metrics instrumentation',
      explanation: 'OpenTelemetry provides tracing (showing the request flow through ChatModel, advisors, tool calls, etc.) and metrics (counting requests, token usage, latency, etc.). These are auto-instrumented by Spring AI.'
    }
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
difficulty: 'expert',
    estimatedTime: 25,    params: [
      { name: 'question', label: 'Question', defaultValue: 'What is Java', placeholder: 'The question', description: 'Question being evaluated' },
      { name: 'answer', label: 'Answer', defaultValue: 'Java is a programming language', placeholder: 'The answer to evaluate', description: 'Answer to check' },
      { name: 'context', label: 'Context', defaultValue: 'Spring AI is a framework', placeholder: 'Context for fact-check', description: 'Reference context (for factcheck)' },
    ],
    example: 'curl "http://localhost:8080/ai/eval/relevancy?question=What%20is%20Java&answer=Java%20is%20a%20programming%20language"\ncurl "http://localhost:8080/ai/eval/factcheck?context=Spring%20AI%20is%20a%20framework&answer=Spring%20AI%20is%20a%20framework"',
    responseHint: 'PASS/FAIL verdict with one-sentence reason',
    concepts: ['LLM-as-a-Judge', 'PASS/FAIL', 'mock(ChatModel)'],
    sourceFiles: ['com/imm/springai/EvalController.java'],
    architecture: "### Evaluation Flow\n\nUser submits a question and answer → LLM-as-a-Judge (second prompt) evaluates the answer against the context → the judge checks relevancy and factuality → PASS/FAIL verdict is returned to the user.\n\n**Flow:**\n- **User** → Question + Answer → **LLM-as-a-Judge** → Context + Answer → Verdict Generation → PASS/FAIL → **User**\n\nSee [Spring AI Evaluation](https://docs.spring.io/spring-ai/reference/eval.html) for details.",
    checkpoint: {
      type: 'multiple-choice',
      question: 'What is "LLM-as-a-Judge" in Spring AI 2.0?',
      options: ['A new model provider', 'Using a second LLM to evaluate the first answer', 'A Java evaluator class', 'A testing framework'],
      answer: 'Using a second LLM to evaluate the first answer',
      explanation: 'Spring AI 2.0 replaced dedicated Evaluator classes with "LLM-as-a-Judge" — you ask a second prompt to evaluate the first answer. Two judges: relevancy (does the answer address the question?) and fact-check (is the answer supported by the context?).'
    }
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