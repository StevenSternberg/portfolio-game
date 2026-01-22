import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const theme = process.env.VITE_THEME
  const base =
    command === 'serve' ? '/' : theme ? `/portfolio-game/${theme}/` : '/portfolio-game/'

  return {
    base,
    plugins: [react()],
  }
})
