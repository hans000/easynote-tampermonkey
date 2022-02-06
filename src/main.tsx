import './index.less'
import { render } from 'preact'
import { App } from './views/app'
import { AppElement, RootElement } from './tools/const'
import { matched } from './core/base/config'
import { Beautify } from './core/beautify'

const __DEV__ = import.meta.env.DEV

export class GlobalVar {
    public static running = false
    public static Beautify: Beautify
    public static AppElement: HTMLElement
    public static RootElement: HTMLElement
    public static matchItem = matched(window.location.href)
}

if (__DEV__ || GlobalVar.matchItem) {
    const root = GlobalVar.RootElement = document.createElement(RootElement)
    const app = GlobalVar.AppElement = document.createElement(AppElement)
    
    document.body.appendChild(app)
    document.body.appendChild(root)
    GlobalVar.Beautify = new Beautify(root, app, GlobalVar.matchItem)

    render(<App />, root)
}

 