# ☁️ Deployed Labs Guide

Use the **live deployed version** of Spring AI Tour without any local setup!

## 🌐 Accessing Deployed Labs

The deployed version is available at:
👉 [https://springaitour.vercel.app/](https://springaitour.vercel.app/)

### Backend API
👉 [https://spring-ai-tour-backend.onrender.com](https://spring-ai-tour-backend.onrender.com)

## 🚀 Quick Start

1. Visit [Spring AI Tour](https://springaitour.vercel.app/)
2. No setup required! All labs use the deployed backend
3. Start with the **Plain Chat** lab

## 🔑 API Key Configuration

The deployed backend uses a **shared API key** for demonstration purposes.

⚠️ **Note**: For production use, you should:
1. Deploy your own backend
2. Use your own OpenRouter API key
3. Keep your key secure

## 📡 API Endpoints

All endpoints are prefixed with `/api`:

| Lab | Endpoint | Method |
|-----|----------|--------|
| Plain Chat | `/api/ai` | GET |
| RAG | `/api/ai/rag` | GET |
| Structured Output | `/api/ai/structured` | POST |
| Memory | `/api/ai/memory` | GET |
| Tools | `/api/ai/tools` | POST |
| ... | ... | ... |

## 🔧 Advanced Usage

### Custom Backend URL

If you've deployed your own backend, you can configure the frontend to use it:

1. Fork the frontend repository
2. Update `VITE_API_BASE_URL` in `.env.production`
3. Redeploy to Vercel

### Local Backend with Deployed Frontend

You can also use the deployed frontend with your local backend:

1. Start your local backend (port 8080)
2. Use a proxy tool like [ngrok](https://ngrok.com/) to expose it:
   ```bash
   ngrok http 8080
   ```
3. Configure your frontend to use the ngrok URL

## ⚙️ Rate Limits

The deployed backend has rate limits:
- 10 requests per minute per IP
- 100 requests per day per IP

For higher limits, deploy your own backend.

## 📊 Monitoring

The backend includes:
- Health check endpoint: `/api/health`
- Metrics endpoint: `/api/metrics` (if configured)
