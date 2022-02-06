import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import banner from 'vite-plugin-banner'

const prefix = `
// ==UserScript==
// @name            easy-note
// @namespace       http://tampermonkey.net/
// @version         0.0.1
// @description     easy-note
// @author          hans0000
// @match           http*://*/*
// @grant           none
// @run-at          document-end
// @require         https://cdn.jsdelivr.net/npm/preact@10.6.5/dist/preact.umd.js
// @require         https://cdn.jsdelivr.net/npm/preact@10.6.5/hooks/dist/hooks.umd.js
// @require         https://cdn.jsdelivr.net/npm/preact@10.6.5/compat/dist/compat.umd.js
// ==/UserScript==
`.trimStart()

// https://vitejs.dev/config/
export default defineConfig({
    mode: 'production',
    plugins: [
        preact({
            devtoolsInProd: true
        }),
        banner(prefix),
    ],
    build: {
        target: 'esnext',
        assetsDir: './',
        minify: false,
        polyfillModulePreload: false,
        rollupOptions: {
            output: {
                format: 'iife',
                globals: {
                    'preact': 'preact',
                    'preact/hooks': 'preactHooks',
                    'preact/compat': 'preactCompat',
                }
            },
            external: [
                'preact',
                'preact/hooks',
                'preact/compat',
            ],
        },
    },
})
