import { AppElement } from './../../tools/const';
import { MatchItem } from './../base/config';
import { RootElement } from '../../tools/const';
import { simplify } from '../simplify';
import { initSelect } from '../bookmark/reselect';
import { MainNoteRef } from '../../components/MainNote';
import { ContentProps } from '../../components/MainNote/Content';

export class Beautify {
    private app: HTMLElement
    private root: HTMLElement
    private matchItem: MatchItem
    private cacheNodeList: HTMLElement[] = []
    private title = ''

    constructor(root: HTMLElement, app: HTMLElement, matchItem: MatchItem) {
        this.root = root
        this.app = app
        this.matchItem = matchItem
    }

    private getContentData(node: HTMLElement) {
        const isHeadNode = (tagName: string) => ['h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)

        let index = 0
        const data: ContentProps[] = []

        Array.from(node.children).forEach(child => {
            const tagName = child.tagName.toLowerCase()

            if (tagName === 'h1' && !this.title) {
                this.title = child.textContent
                child.remove()
            }

            if (isHeadNode(tagName)) {
                // 添加描点
                child.id = index + ''
                data.push({
                    text: child.textContent,
                    hash: '#' + index,
                    class: tagName
                })

                index++
            }
        })

        return data
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

    public run(ref: MainNoteRef) {
        const mountNode = ref.article
        this.root.classList.add('active')
    
        if (mountNode.children.length) {
            this.hiddenBodyAndChildren()
            this.app.classList.remove('hidden')
            return
        }
    
        const originNode = document.querySelector(this.matchItem.selector ?? '')
        if (! originNode) {
            return
        }
    
        this.hiddenBodyAndChildren()
        mountNode.appendChild(simplify(originNode as unknown as HTMLElement))
        ref.createContent(this.getContentData(mountNode))
        ref.title.textContent = this.title
        this.app.style.display = 'block'
        initSelect(this.app, this.matchItem)
    }
    
    public restore() {
        if (document.body.hasAttribute('minWidth')) {
            document.body.style.minWidth = document.body.getAttribute('minWidth')!
        }
    
        const fragment = document.createDocumentFragment()
        this.cacheNodeList.forEach(node => fragment.appendChild(node))
        this.cacheNodeList = []
        document.body.insertBefore(fragment, this.root)
        this.app.classList.add('hidden')
        this.root.classList.remove('active')
    }
} 