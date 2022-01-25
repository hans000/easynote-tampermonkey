import path from 'path'
import resolve from 'rollup-plugin-node-resolve' // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs' // commonjs模块转换插件
import ts from 'rollup-plugin-typescript2'
// import injectProcessEnv from 'rollup-plugin-inject-process-env';
import styles from "rollup-plugin-styles";

const getPath = p => path.resolve(__dirname, p)

// ts
const tsPlugin = ts({
    tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
})

export default {
    input: getPath('./src/index.ts'),
    plugins: [
        resolve({ extensions: [ '.ts' ] }),
        commonjs(),
        tsPlugin,
        // injectProcessEnv({ 
        //     NODE_ENV: 'production',
        // }),
        styles(),
    ],
    external: [
    ],
    output: {
        format: 'iife',
        file: 'bundle.js',
        banner: `
// ==UserScript==
// @name         Easy Note v2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Easy Note v2
// @author       hans0000
// @match        https://*/*
// @grant        none
// ==/UserScript==
        `.trimStart()
    }
}