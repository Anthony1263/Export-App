
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Embed the API Key provided
  env.API_KEY = "AIzaSyAFGkdbkGjp36MAH7IEXor3SeLBQ20xR5c";

  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY works in your code
      'process.env': env
    }
  }
})
