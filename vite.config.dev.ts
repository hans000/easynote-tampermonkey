import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import banner from 'vite-plugin-banner'
import { resolve } from 'path'

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
// @require         https://cdn.jsdelivr.net/npm/lz-string
// ==/UserScript==
`.trimStart()

// https://vitejs.dev/config/
export default defineConfig({
    mode: 'development',
    css: {
        preprocessorOptions: {
            less: {
                additionalData: `@import "${resolve(__dirname, './src/style.less')}";`,
                javascriptEnabled: true,
            }
        }
    },
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
                    'lz-string': 'lzString',
                }
            },
            external: [
                'preact',
                'preact/hooks',
                'preact/compat',
                'lz-string',
            ],
        },
    },
})
