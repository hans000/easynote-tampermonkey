import { defineConfig, loadEnv } from 'vite'
import preact from '@preact/preset-vite'
import banner from 'vite-plugin-banner'
import { resolve } from 'path'


export const branch = loadEnv('production', './')['VITE_BRANCH']

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
// @require         https://cdn.jsdelivr.net/npm/html-to-md@0.5.7/dist/index.js
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @resource config https://raw.github.com/hans000/easynote-tampermonkey/${branch}/public/config.json
// @resource style  https://raw.github.com/hans000/easynote-tampermonkey/${branch}/public/style.css
// @resource font  https://fonts.googleapis.com/icon?family=Material+Icons
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
            input: resolve(__dirname, 'index.prod.html'),
            output: {
                format: 'iife',
                globals: {
                    'preact': 'preact',
                    'preact/hooks': 'preactHooks',
                    'preact/compat': 'preactCompat',
                    'lz-string': 'lzString',
                    'html-to-md': 'html2md',
                }
            },
            external: [
                'preact',
                'preact/hooks',
                'preact/compat',
                'lz-string',
                'html-to-md',
            ],
        },
    },
})
