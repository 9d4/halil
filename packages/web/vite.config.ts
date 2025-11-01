import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

const apiBaseURL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export default defineConfig({
    plugins: [sveltekit()],
    // Proxy api request for development
    server: {
        proxy: {
            '/api': {
                target: apiBaseURL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
})
