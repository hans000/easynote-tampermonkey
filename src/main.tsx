import './index.less'
import { render } from 'preact'
import { App } from './views/app'
import { RootElement } from './tools/const'
import { matched } from './core/base/config'
import { Beautify } from './core/beautify'
import { createDivNode } from './tools'
import './style.less'

GM_addStyle(GM_getResourceText('style'))

export class GlobalVar {
    public static running = false
    public static Beautify: Beautify
    public static AppElement: HTMLElement
    public static RootElement: HTMLElement
    public static ActiveMarks: HTMLElement[]
    public static matchItem = matched(window.location.href)
}

if (GlobalVar.matchItem) {
    const root = GlobalVar.RootElement = createDivNode(RootElement)
    document.body.appendChild(root)
    render(<App />, root)
}

 