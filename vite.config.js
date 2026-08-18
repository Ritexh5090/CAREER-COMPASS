import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites from /<repository-name>/.
  // The deployment workflow supplies this value automatically.
  base: '/CAREER-COMPASS/',
})
