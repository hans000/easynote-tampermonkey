import './index.less'
import { render } from 'preact'
import { App } from './views/app'
import { AppElement, RootElement } from './tools/const'
import { matched } from './core/base/config'
import { Beautify } from './core/beautify'
import { HoverMenu } from './components/HoverMenu'

const __DEV__ = import.meta.env.DEV

export class GlobalVar {
    public static running = false
    public static Beautify: Beautify
    public static AppElement: HTMLElement
    public static RootElement: HTMLElement
    public static ActiveMarks: HTMLElement[]
    public static matchItem = matched(window.location.href)
}

if (__DEV__) {
    const root = document.createElement(RootElement)
    document.body.appendChild(root)
    render(<HoverMenu onClick={() => {}} />, root)
}

if (GlobalVar.matchItem) {
    const root = GlobalVar.RootElement = document.createElement(RootElement)
    const app = GlobalVar.AppElement = document.createElement(AppElement)
    
    document.body.appendChild(app)
    document.body.appendChild(root)
    GlobalVar.Beautify = new Beautify(root, app, GlobalVar.matchItem)

    render(<App />, root)
}

 