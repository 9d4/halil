import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const apiBaseURL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export default defineConfig({
    plugins: [sveltekit(), tailwindcss()],
    resolve: {
        alias: {
            'halil/server': path.resolve(__dirname, '../server'),
        },
    },
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
