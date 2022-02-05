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
// ==/UserScript==
`.trimStart()

// https://vitejs.dev/config/
export default defineConfig({
    mode: 'development',
    plugins: [
        preact({
            devtoolsInProd: true
        }),
        banner(prefix),
    ],
    build: {
        assetsDir: './',
        minify: false,
        rollupOptions: {
            output: {
                format: 'iife',
            },
        }
    }
})
