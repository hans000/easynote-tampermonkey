import { render } from 'preact'
import { App } from './views/app'
import { AppElement, RootElement } from './tools/const'
import { matched } from './core/base/config'
import './index.less'
import { Beautify } from './core/beautify'

const __DEV__ = import.meta.env.DEV
const matchItem = matched(window.location.href)

if (__DEV__ || matchItem) {

    const root = document.createElement(RootElement)
    const app = document.createElement(AppElement)
    
    document.body.appendChild(app)
    document.body.appendChild(root)

    const beautify = new Beautify(root, app, matchItem)
    
    render(<App
        beautify={beautify}
        rootElement={root}
        appElement={app}
        matchItem={matchItem!} />,
        root
    )
}

 