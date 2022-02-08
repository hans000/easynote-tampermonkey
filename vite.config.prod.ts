import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import banner from 'vite-plugin-banner'

const prefix = `
// ==UserScript==
// @name            easynote
// @namespace       http://tampermonkey.net/
// @version         0.0.1
// @description     easynote
// @author          hans0000
// @match           http*://*/*
// @run-at          document-end
// @require         https://cdn.jsdelivr.net/npm/preact@10.6.5/dist/preact.umd.js
// @require         https://cdn.jsdelivr.net/npm/preact@10.6.5/hooks/dist/hooks.umd.js
// @require         https://cdn.jsdelivr.net/npm/preact@10.6.5/compat/dist/compat.umd.js
// @require         https://cdn.jsdelivr.net/npm/clsx@1.1.1/dist/clsx.min.js
// @grant           GM_getResourceText
// @resource config https://raw.github.com/hans000/easynote-tampermonkey/main/public/config.json
// @resource style  https://raw.github.com/hans000/easynote-tampermonkey/main/public/style.css
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
                    'clsx': 'clsx',
                }
            },
            external: [
                'preact',
                'preact/hooks',
                'preact/compat',
                'clsx',
            ],
        },
    },
})
