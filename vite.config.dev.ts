import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'


// https://vitejs.dev/config/
export default defineConfig({
    mode: 'development',
    plugins: [
        preact(),
    ],
    build: {
        target: 'esnext',
        assetsDir: './',
        polyfillModulePreload: false,
        rollupOptions: {
            output: {
                format: 'iife',
            },
        },
    },
})
