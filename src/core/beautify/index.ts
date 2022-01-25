import { HoverElement } from './../../tools/const';
import { EasyNote, MarkedHideElement, RootElement } from '../../tools/const'
import { simplify } from '../../tools/simplify'
import { createRootNode, getRootElement } from '../base'
import './style.less'
import { initSelect } from '../bookmark';

const config = [
    {
        url: 'https://zhuanlan.zhihu.com/p/',
        selector: 'article.Post-Main'
    },
    {
        url: 'https://juejin.cn/post/',
        selector: 'article.article'
    },
]

function hidden() {
    Array.from(document.body.children as any as HTMLElement[]).forEach((node) => {
        const tagName = node.tagName.toLowerCase()
        if (! ['script', EasyNote, HoverElement].includes(tagName)) {
            node.style.display = 'none'
            node.setAttribute(MarkedHideElement, '')
        }
    })
}

function render(node: HTMLElement) {
    const root = createRootNode()
    root.appendChild(simplify(node))
    document.body.appendChild(root)
}

export function run() {
    const root = getRootElement()
    if (root) {
        hidden()
        root.style.display = 'block'
        return
    }

    const item = config.find(item => window.location.href.startsWith(item.url))
    const originNode = document.querySelector(item?.selector ?? '')
    if (! originNode) {
        return
    }

    hidden()
    render(originNode as unknown as HTMLElement)
    initSelect()
}

export function restore() {
    Array.from(document.body.children as any as HTMLElement[]).forEach((node) => {
        if (node.getAttribute(MarkedHideElement) === '') {
            node.style.display = 'block'
        }
    })

    const root = getRootElement()
    root.style.display = 'none'
}
