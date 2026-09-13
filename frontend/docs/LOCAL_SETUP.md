# 🚀 Local Lab Setup Guide

Follow these instructions to run the Spring AI Tour **locally** on your machine.

## 📋 Prerequisites

- [Java 21+](https://www.oracle.com/java/technologies/downloads/)
- [Spring Boot 4.1.x](https://spring.io/projects/spring-boot)
- [Git](https://git-scm.com/)
- An API key from [OpenRouter](https://openrouter.ai/) (or any OpenAI-compatible provider)
- Optional: [Docker](https://www.docker.com/) (for vector store demos)

## 🛠️ Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/springai.git
cd springai
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
```

### 3. Start the Backend Server
```bash
# Build and run (also builds the UI into static/)
./gradlew bootRun

# Or for development with hot reload
./gradlew bootJar
java -jar build/libs/backend-*.jar
```

The backend will start at `http://localhost:8080`

### 4. Configure Frontend
```bash
cd ../frontend
cp .env.local.example .env.local  # if needed
# Edit .env.local if needed (default points to localhost:8080)
npm install
```

### 5. Start the Frontend
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`

### 6. Verify Setup
1. Open `http://localhost:5173` in your browser
2. Complete the Health Check on the homepage
3. Start with the **Plain Chat** lab

## 🧪 Running Specific Labs

All labs work with the local backend. No additional configuration needed.

## 🔌 API Endpoints

| Lab | Endpoint | Method | Parameters |
|-----|----------|--------|------------|
| Plain Chat | `/api/ai` | GET | `userInput` |
| RAG | `/api/ai/rag` | GET | `q`, `threshold` |
| Structured Output | `/api/ai/structured` | POST | JSON body |
| ... | ... | ... | ... |

## ⚠️ Troubleshooting

See [DEPLOYED_LABS.md](./DEPLOYED_LABS.md) for tips.
