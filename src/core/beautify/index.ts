import { AppElement } from './../../tools/const';
import { MatchItem } from './../base/config';
import { MainClassname, RootElement } from '../../tools/const';
import { simplify } from '../simplify';
import { initSelect } from '../bookmark/reselect';

export class Beautify {
    private app: HTMLElement
    private root: HTMLElement
    private matchItem: MatchItem
    private cacheNodeList: HTMLElement[] = []

    constructor(root: HTMLElement, app: HTMLElement, matchItem: MatchItem) {
        this.root = root
        this.app = app
        this.matchItem = matchItem
    }

    
    private hiddenBodyAndChildren() {
        Array.from(document.body.children as any as HTMLElement[]).forEach((node) => {
            const tagName = node.tagName.toLowerCase()
            if (! ['script', RootElement, AppElement].includes(tagName)) {
                this.cacheNodeList.push(document.body.removeChild(node))
            }
        })

        const calcBodyStyle = window.getComputedStyle(document.body)
        if (calcBodyStyle.minWidth) {
            document.body.setAttribute('minWidth', calcBodyStyle.minWidth)
            document.body.style.minWidth = '0'
        }
    }

    private render(node: HTMLElement) {
        const main = document.createElement('div')
        main.classList.add(MainClassname)
        main.appendChild(simplify(node))
        this.app.appendChild(main)
        this.app.style.display = 'block'
    }

    public run() {
        this.root.classList.add('active')
    
        if (this.app.children.length) {
            this.hiddenBodyAndChildren()
            this.app.classList.remove('hidden')
            return
        }
    
        const originNode = document.querySelector(this.matchItem.selector ?? '')
        if (! originNode) {
            return
        }
    
        this.hiddenBodyAndChildren()
        this.render(originNode as unknown as HTMLElement)
        initSelect(this.app, this.matchItem)
    }
    
    public restore() {
        if (document.body.hasAttribute('minWidth')) {
            document.body.style.minWidth = document.body.getAttribute('minWidth')!
        }
    
        const fragment = document.createDocumentFragment()
        this.cacheNodeList.forEach(node => fragment.appendChild(node))
        document.body.insertBefore(fragment, this.root)
        this.app.classList.add('hidden')
        this.root.classList.remove('active')
    }
}