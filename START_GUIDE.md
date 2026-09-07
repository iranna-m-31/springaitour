# Spring AI Tutor — Start Guide

## What you have

A complete Spring Boot project that demonstrates 16 Spring AI features through
an interactive web UI. The UI is built into the project and served from the
same server.

## Step-by-step

### 1. Get the project

- **Download ZIP**: Click the **Download ZIP** button in the web UI at `http://localhost:8080/download`
- **Clone**: `git clone <repo-url>`

### 2. Set up your API key

The project uses OpenRouter for its LLM calls. Edit
`src/main/resources/application.properties`:

```properties
spring.ai.openai.api-key=sk-or-v1-YOUR-KEY-HERE
spring.ai.openai.base-url=https://openrouter.ai/api/v1
```

If you don't have an OpenRouter key, get one for free at
[openrouter.ai](https://openrouter.ai/keys).

### 3. Start the server

```bash
./gradlew bootRun
```

You should see `Started SpringaiApplication` and the server is ready on
port 8080.

### 4. Open the tutorial

Open your browser to: `http://localhost:8080`

That's it — the tutorial UI loads automatically. Click through the features
on the left sidebar, read the explanation, fill in the demo form, and click
**Try It** to see the live response.

### 5. (Optional) Rebuild the React UI

If you want to change the UI, rebuild it:

```bash
cd springai-tutor-ui
npm install
npm run build
```

The build output goes to `../src/main/resources/static/` — just restart the
server after building.

---

## Deploy UI to Vercel

You can host the React UI on Vercel (free tier) while keeping the Spring Boot
backend running on your local machine or a server. This lets cloners:

1. Open the Vercel-hosted UI
2. Run Spring Boot locally with their own OpenRouter key
3. See responses from their own server

### Quick Deploy

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import your GitHub repo
3. Set **Root Directory** to `springai-tutor-ui`
4. Set **Build Command**: `pnpm run vercel-build`
5. Set **Output Directory**: `dist`
6. Add Environment Variable: `VITE_API_BASE_URL` → your Spring Boot URL
   - For local testing: `http://localhost:8080`
   - For your own server: `https://your-server.com`
7. Click **Deploy**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

---

## Project structure

```
springai/
├── build.gradle.kts          # Gradle build
├── settings.gradle.kts
├── compose.yaml              # Docker Compose for Postgres/Redis
├── SPRING_AI_TUTOR.md        # Full feature guide (markdown)
├── SpringAI_Tutor.postman_collection.json
├── src/main/java/com/imm/springai/
│   ├── ChatController.java    # Plain chat
│   ├── TutorController.java   # System prompts, templates, streaming, structured, multimodal
│   ├── ToolController.java    # Tool calling
│   ├── MemoryController.java  # Chat memory
│   ├── EmbeddingController.java  # Embeddings + semantic FAQ
│   ├── RagController.java     # RAG with vector store
│   ├── ModerationController.java
│   ├── EvalController.java    # LLM-as-a-Judge
│   ├── DownloadController.java # ZIP download
│   └── ...
├── src/main/resources/
│   ├── application.properties
│   ├── docs/spring-ai.md      # Sample docs for RAG
│   ├── multimodal.test.png    # Image for multimodal demo
│   └── static/                # React build output
└── springai-tutor-ui/         # React + TypeScript source
    ├── package.json
    ├── vite.config.ts
    └── src/
```