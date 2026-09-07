# Spring AI Tutor — Vercel Deployment Guide

This project deploys the **React UI to Vercel** and lets users run the **Spring Boot backend locally** on their own machine or server. The UI on Vercel calls the user's local Spring Boot API.

This is intentional: the project is a *tutor guide*, not a hosted SaaS. Each user runs the backend themselves with their own OpenRouter API key.

---

## Architecture

```
User's Browser
   │
   ├─── https://your-app.vercel.app  (React UI on Vercel)
   │
   └─── http://localhost:8080        (Spring Boot on user's machine)
            │
            └─── OpenRouter API  (https://openrouter.ai/api/v1)
```

The Vercel-hosted UI makes API calls to the user's locally-running Spring Boot server.

---

## Step 1: Fork or Clone the Repository

```bash
git clone <your-repo-url>
cd springai
```

---

## Step 2: Set Up Local Spring Boot (for testing)

```bash
# Copy the env template
cp .env.example .env

# Edit .env and add your OpenRouter API key
# OPENROUTER_API_KEY=sk-or-v1-YOUR-KEY

# Run the server (builds UI + starts Spring Boot)
./gradlew bootRun

# Or build a JAR for deployment to a server
./gradlew bootJar
java -jar build/libs/springai-0.0.1-SNAPSHOT.jar
```

The server is now at `http://localhost:8080`. Test it:

```bash
curl "http://localhost:8080/ai?userInput=Hello"
```

---

## Step 3: Deploy UI to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Root Directory**: `springai-tutor-ui`
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run vercel-build` (or `npm run vercel-build`)
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` (or `npm install`)

5. **Environment Variables** (in Vercel dashboard):
   - `VITE_API_BASE_URL` = your Spring Boot server URL
     - For local testing: `http://localhost:8080`
     - For your own server: `https://your-server.com`

6. Click **Deploy**

Vercel will:
- Install dependencies
- Build the React UI
- Deploy to `https://your-app.vercel.app`

---

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# From the springai-tutor-ui directory
cd springai-tutor-ui

# Login
vercel login

# Deploy
vercel --prod

# Set environment variable
vercel env add VITE_API_BASE_URL production
# Enter: http://localhost:8080 (or your server URL)

# Redeploy with new env
vercel --prod
```

---

## Step 4: Configure CORS

CORS is already enabled in `application.properties` to allow the Vercel frontend to call the Spring Boot server from any origin.

**For production**, you should restrict CORS to your Vercel domain:

```properties
# Replace * with your Vercel domain
spring.mvc.cors.allowed-origins=https://your-app.vercel.app
```

Or use a `WebConfig.java` for more control:

```java
@Configuration
class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/ai/**")
            .allowedOrigins("https://your-app.vercel.app")
            .allowedMethods("GET", "POST", "OPTIONS")
            .allowedHeaders("*");
    }
}
```

---

## How It Works in Production

1. **User opens Vercel app** at `https://your-app.vercel.app`
2. **React UI loads** with all the tutor demos
3. **User runs Spring Boot** on their machine: `./gradlew bootRun` or `java -jar ...`
4. **User enters their OpenRouter key** in `.env`
5. **UI calls user's localhost Spring Boot** (via `VITE_API_BASE_URL`)
6. **Spring Boot calls OpenRouter API** with user's key
7. **Response flows back**: OpenRouter → Spring Boot → Vercel UI

---

## Important: VITE_API_BASE_URL

The React UI uses `VITE_API_BASE_URL` to know where the Spring Boot server is. This is set in Vercel environment variables.

| Environment | VITE_API_BASE_URL |
|-------------|-------------------|
| Local dev (Vite + Spring Boot) | `http://localhost:8080` (default) |
| Vercel preview + local Spring Boot | `http://localhost:8080` (user runs locally) |
| Vercel prod + user's own server | `https://user-server.com` |

**Note**: Browsers block `http://localhost` from `https://*.vercel.app` due to mixed content. For production, your Spring Boot server needs HTTPS or use a tunneling service like ngrok.

---

## Optional: ngrok for Local HTTPS

To expose your local Spring Boot over HTTPS:

```bash
# Run Spring Boot
./gradlew bootRun

# In another terminal, start ngrok
ngrok http 8080

# Use the ngrok HTTPS URL as VITE_API_BASE_URL
# e.g., https://abc123.ngrok-free.app
```

---

## What Gets Deployed Where

| Component | Location | Built By |
|-----------|----------|----------|
| React UI (`springai-tutor-ui/dist/`) | Vercel | Vercel build |
| Spring Boot JAR (`build/libs/*.jar`) | User's local/server | `./gradlew bootJar` |
| RAG documents | Inside JAR (classpath) | Pre-bundled |
| OpenRouter API key | `.env` on user's machine | User-managed |

---

## CI/CD (Optional)

Add a GitHub Actions workflow to auto-deploy the UI on every push:

```yaml
# .github/workflows/deploy-ui.yml
name: Deploy UI to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd springai-tutor-ui && pnpm install
      - run: cd springai-tutor-ui && pnpm run vercel-build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: springai-tutor-ui
```

---

## Troubleshooting

### CORS error in browser console
- Check that `spring.mvc.cors.allowed-origins` includes your Vercel domain
- Verify `VITE_API_BASE_URL` is set correctly in Vercel

### UI loads but API calls fail
- Make sure Spring Boot is running on the URL specified in `VITE_API_BASE_URL`
- Check browser network tab for the exact error

### Mixed content (HTTPS → HTTP)
- Use ngrok to expose your local server with HTTPS
- Or deploy Spring Boot to a server with HTTPS

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure `pnpm` is used (project has `pnpm-lock.yaml`)

---

## Summary

| Step | Action |
|------|--------|
| 1 | Clone repo |
| 2 | Run Spring Boot locally (with your OpenRouter key) |
| 3 | Deploy React UI to Vercel (point to your server) |
| 4 | Open Vercel app, test demos against your local server |

The moto: **clone → run locally → see responses from your server**. No need to deploy the full app — just the UI.
