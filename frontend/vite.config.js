import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Dashboard (default route) + Recharts are deliberately kept in the main
    // bundle to avoid a request waterfall on first load, so this chunk being
    // large is expected, not a mistake worth warning about on every build.
    chunkSizeWarningLimit: 750,
  },
})