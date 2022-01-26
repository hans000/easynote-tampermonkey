import { AppElement } from './../../tools/const';
import { MatchItem } from './../base/config';
import { getAppElement, getRootElement } from '../base'
import { initSelect } from '../bookmark';
import { MainClassname, RootElement } from '../../tools/const';
import './style.less'
import { simplify } from '../simplify';

let cacheNodeList: HTMLElement[] = []

function hiddenBodyAndChildren() {
    Array.from(document.body.children as any as HTMLElement[]).forEach((node) => {
        const tagName = node.tagName.toLowerCase()
        if (! ['script', RootElement, AppElement].includes(tagName)) {
            cacheNodeList.push(document.body.removeChild(node))
        }
    })

    const calcBodyStyle = window.getComputedStyle(document.body)
    if (calcBodyStyle.minWidth) {
        document.body.setAttribute('minWidth', calcBodyStyle.minWidth)
        document.body.style.minWidth = '0'
    }
}

function render(node: HTMLElement) {
    const app = getAppElement()
    const main = document.createElement('div')
    main.classList.add(MainClassname)
    main.appendChild(simplify(node))
    app.appendChild(main)
    app.style.display = 'block'
}

export function run(matchItem: MatchItem) {
    getRootElement().classList.add('active')
    const app = getAppElement()

    if (app.children.length) {
        hiddenBodyAndChildren()
        app.classList.remove('hidden')
        return
    }

    const originNode = document.querySelector(matchItem.selector ?? '')
    if (! originNode) {
        return
    }

    hiddenBodyAndChildren()
    render(originNode as unknown as HTMLElement)
    initSelect(matchItem)
}

export function restore() {

    if (document.body.hasAttribute('minWidth')) {
        document.body.style.minWidth = document.body.getAttribute('minWidth')!
    }

    const app = getAppElement()
    const fragment = document.createDocumentFragment()
    cacheNodeList.forEach(node => fragment.appendChild(node))
    document.body.insertBefore(fragment, getRootElement())
    app.classList.add('hidden')
    getRootElement().classList.remove('active')
}
