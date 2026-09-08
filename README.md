# Spring AI Tutor

An interactive tutorial for learning Spring AI 2.0.1 with hands-on demos, live API calls, and real Java source code.

## 🚀 Live Demo

Try the tutorial online: [springaitour.vercel.app](https://springaitour.vercel.app)

![Spring AI Tutor Screenshot](https://via.placeholder.com/800x400?text=Spring+AI+Tutor+Screenshot)

## 📖 Overview

The Spring AI Tutor provides 16 interactive modules covering:
- **Foundations**: Plain chat, system prompts, prompt templates, streaming, metadata
- **Core Features**: Structured output, multimodality, tool calling, chat memory, advisors API
- **Advanced Patterns**: Embeddings, vector store + RAG, moderation
- **Specialized Topics**: Model Context Protocol (MCP), observability, evaluation

Each module includes:
- Plain-English explanation of the concept
- Concept
- Actual Spring AI source code with key lines highlighted
- Live "Try It" panel to call real API endpoints
- Example curl commands
- Links to official Spring AI documentation

## 🛠️ Clone & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/iranna-m-31/springaitour.git
cd springai

# 2. Configure your OpenRouter API key
# Copy .env.example to .env and add your key
cp .env.example .env
# Edit .env and add your OpenRouter API key:
# OPENROUTER_API_KEY=your-key-here

# 3. Start the server
./gradlew bootRun

# 4. Open your browser
http://localhost:8080
```

## 📚 Documentation

- [Spring AI Reference Documentation](https://docs.spring.io/spring-ai/reference/index.html)
- [Project Setup Guide](START_GUIDE.md)
- [Architecture Overview](SPRING_AI_TUTOR.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).