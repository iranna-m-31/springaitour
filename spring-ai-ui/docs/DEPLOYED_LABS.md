# ☁️ Deployed Labs Guide

Use the **live deployed version** of Spring AI Tour **without any local setup**!

## 🌐 Access the Deployed Labs

👉 **[Start Deployed Labs](https://spring-ai-ui.vercel.app/)**

The deployed version includes:
- **All 16 hands-on labs** with live API calls
- **Real responses** from LLMs (via OpenRouter)
- **Actual Java source code** behind each feature

## 🚀 Quick Start

1. **Visit the deployed frontend**:
   [https://spring-ai-ui.vercel.app/](https://spring-ai-ui.vercel.app/)

2. **No setup required!** All labs use the **deployed backend**:
   [https://spring-ai.onrender.com](https://spring-ai.onrender.com)

3. **Start with the first lab**:
   - Click on **"Foundations"** module
   - Begin with **"Plain Chat"** (Feature 1 of 16)

## 🔌 Backend API

The deployed backend is hosted on **Render**:
- **URL**: `https://spring-ai.onrender.com`
- **Health Check**: `https://spring-ai.onrender.com/api/health`
- **Status**: ![Render Status](https://img.shields.io/badge/Render-Deployed-green)

### **API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check backend status |
| `/api/ai` | GET | Plain chat (requires `userInput` param) |
| `/api/ai/rag` | GET | RAG search (requires `q` param) |
| `/api/ai/rag/filtered` | GET | RAG with similarity threshold |
| `/api/ai/rag/debug` | GET | RAG with debug info |

## 🔑 API Key Information

The deployed backend uses a **shared OpenRouter API key** for demonstration purposes.

⚠️ **Important Notes**:
- The shared key has **rate limits** (10 requests/minute, 100 requests/day)
- For **unlimited usage**, deploy your own backend (see [Local Setup Guide](/docs/LOCAL_SETUP.md))
- **Do not expose your own API keys** in frontend code

## 📊 Features

| Feature | Status | Notes |
|---------|--------|-------|
| Plain Chat | ✅ Working | Basic LLM chat |
| RAG | ✅ Working | Semantic search |
| Structured Output | ✅ Working | JSON responses |
| Memory | ✅ Working | Conversation history |
| Tools | ✅ Working | Function calling |
| Embeddings | ✅ Working | Vector representations |
| Vector Stores | ✅ Working | Document storage |
| Observability | ⚠️ Limited | Basic health checks |

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend is slow | Free tier on Render has cold starts (30-60s) |
| API calls fail | Check if the backend is awake (visit `/api/health`) |
| Rate limit errors | Use your own API key by deploying the backend |
| CORS errors | Ensure your backend has proper CORS configuration |