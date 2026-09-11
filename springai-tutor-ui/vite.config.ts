import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Build output directory:
// - Vercel deployment: dist/ (standard, Vercel expects this)
// - Spring Boot local/dev: ../src/main/resources/static (so JAR includes UI)
// The SPRING_BOOT_BUILD env var is set by the Gradle uiBuild task.
const springBootBuild = process.env.SPRING_BOOT_BUILD === 'true'

export default defineConfig(({ mode }) => {
  // Load env so VITE_API_BASE_URL is available to the client
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    base: '/',
    build: {
      outDir: springBootBuild ? '../src/main/resources/static' : 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      proxy: {
        // Proxy API calls to Spring Boot during dev
        '/ai': 'http://localhost:8080',
        '/api/tutor': 'http://localhost:8080',
        '/actuator': 'http://localhost:8080',
      },
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL || 'http://localhost:8080'
      ),
    },
  }
})
