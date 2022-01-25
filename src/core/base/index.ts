import './index.less'
import { HoverElement } from './../../tools/const';
import { EasyNote, RootElement } from "../../tools/const"
import { restore, run } from "../beautify"
import { hasSelected } from '../../utils/hasSelected';
import { highlight } from '../bookmark';

let __running = false
let __root: HTMLElement

export function getRootElement() { return __root }

export function isRunning() { return __running }

function createCtrNode() {
    const panel = document.createElement(EasyNote)
    const btn = document.createElement('button')
    
    btn.addEventListener('click', () => {
        __running ? restore() : run()
        __running = !__running
    })
    btn.innerText = 'run'
    panel.append(btn)
    document.body.append(panel)
}

function createHoverNode() {
    const hover = document.createElement(HoverElement)

    document.addEventListener('mouseup', (event) => {
        if (isRunning() && hasSelected()) {
            hover.style.display = 'block'
            hover.style.left = event.clientX + 'px'
            hover.style.top = event.clientY + 'px'
        }
    })
    document.body.addEventListener('mousedown', () => {
        hover.style.display = 'none'
    })

    const button = document.createElement('button')
    button.innerText = '高亮'
    button.addEventListener('mousedown', (e) => {
        highlight()
    })

    hover.appendChild(button)
    document.body.append(hover)
}

export function createRootNode() {
    const root = document.createElement('div')
    __root = root
    root.classList.add(RootElement)
    return root
}

export function init() {
    createCtrNode()
    createHoverNode()
}