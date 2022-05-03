import './index.less'
import { render } from 'preact'
import { App } from './views/app'
import { RootElement } from './tools/const'
import { matched } from './core/base/config'
import { Beautify } from './core/beautify'
import { createDivNode } from './tools'

const __DEV__ = import.meta.env.DEV

if (! __DEV__) {
    GM_addStyle(GM_getResourceText('style'))
    GM_addStyle(GM_getResourceText('font'))
}


export class GlobalVar {
    public static mode: 'view' | 'edit' = 'view'
    public static running = false
    public static Beautify: Beautify
    public static AppElement: HTMLElement
    public static RootElement: HTMLElement
    public static ActiveMarks: HTMLElement[]
    public static matchItem = matched(window.location.href)
}

if (__DEV__ || GlobalVar.matchItem) {
    const root = GlobalVar.RootElement = createDivNode(RootElement)
    document.body.appendChild(root)
    render(<App />, root)
}