import './index.less'
import { HoverElement, ButtonElement, RootElement, AppElement } from './../../tools/const';
import { restore, run } from "../beautify"
import { hasSelected } from '../../tools/hasSelected';
import { highlight } from '../bookmark';
import { matched, MatchItem } from './config';

const HighlightColors = ['#fff066', '#7df066', '#74eaff', '#f799d1', '#eb4949']

let __running = false
/**
 * children 分别是[btn, hover]
 * 
 */
let __root: HTMLElement
let __app: HTMLElement
let __colorType = 0



export function getRootElement() { return __root }
export function getAppElement() { return __app as HTMLElement }
export function getButtonElement() { return __root.children[0] as HTMLElement }
export function getHoverElement() { return __root.children[1] as HTMLElement }
export function getColorType() { return __colorType }

export function isRunning() { return __running }

function initCtrl(matchItem: MatchItem) {
    const panel = getButtonElement()
    const btn = document.createElement('button')
    
    btn.addEventListener('click', () => {
        __running ? restore() : run(matchItem)
        __running = !__running
    })
    btn.innerText = 'beautify'
    panel.append(btn)
}

function initHover(matchItem: MatchItem) {
    const hover = getHoverElement()
    

    __app.addEventListener('mouseup', (event) => {
        event.preventDefault()
        // event.stopPropagation()
        if (isRunning() && hasSelected()) {
            hover.style.display = 'block'
            hover.style.left = event.clientX + 10 + 'px'
            hover.style.top = event.clientY + 'px'
        }
    })
    window.addEventListener('click', (event) => {
        if (!isRunning() || !hasSelected()) {
            hover.style.display = 'none'
        }
    })

    const fragment = document.createDocumentFragment()

    const button = document.createElement('button')
    button.innerText = '高亮'
    button.addEventListener('click', (event) => {
        event.preventDefault()
        // event.stopPropagation()
        highlight(matchItem)
    })

    const mapColor = ['黄', '绿', '蓝', '粉', '红']
    const select = document.createElement('select')
    HighlightColors.forEach((color, index) => {
        const option = document.createElement('option')
        option.value = index + ''
        option.innerText = mapColor[index]
        option.style.backgroundColor = color
        select.appendChild(option)
    })
    select.style.backgroundColor = mapColor[__colorType]
    select.addEventListener('change', (ev: any) => {
        __colorType = +ev.target.value
        select.style.backgroundColor = mapColor[__colorType]
    })

    fragment.appendChild(button)
    fragment.appendChild(select)

    hover.appendChild(fragment)
}

export function createNode() {
    __root = document.createElement(RootElement)

    __app = document.createElement(AppElement)
    const button = document.createElement(ButtonElement)
    const hover = document.createElement(HoverElement)

    __root.appendChild(button)
    __root.appendChild(hover)
    document.body.appendChild(__app)
    document.body.appendChild(__root)
    
    return __root
}


export function init() {
    const item = matched(window.location.href)
    if (item) {
        createNode()
        initCtrl(item)
        initHover(item)
    }
}