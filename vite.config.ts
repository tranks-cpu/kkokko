import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '꼬꼬미노',
        short_name: '꼬꼬미노',
        description: '꼬꼬미노 보드게임 - Heckmeck am Bratwurmeck',
        theme_color: '#f59e0b',
        background_color: '#1c1917',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' as const },
        ],
      },
    }),
  ],
})
