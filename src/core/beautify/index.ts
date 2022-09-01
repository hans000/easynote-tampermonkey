import { getTagName } from './../../tools/index';
import { MatchItem } from './../base/config';
import { RootElement } from '../../tools/const';
import { MainNoteRef } from '../../components/MainNote';
import { ContentProps } from '../../components/MainNote/Content';
import { createFragment } from '../../tools';
import { simplify } from '../render';

export class Beautify {
    private app: HTMLElement
    private root: HTMLElement
    private matchItem: MatchItem
    private cacheNodeList: HTMLElement[] = []
    private title: string
    private titleNode: HTMLElement

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
            const tagName = getTagName(child)

            if (tagName === 'h1') {
                if (this.titleNode && this.titleNode.textContent === child.textContent ||
                    !this.title) {
                    this.title = child.textContent
                    child.remove()
                }
            }

            if (isHeadNode(tagName)) {
                // 添加描点
                child.id = index + ''
                data.push({
                    text: child.textContent,
                    hash: '#' + index,
                    class: 'ea-' + tagName
                })

                index++
            }
        })

        return data
    }
    
    private hiddenBodyAndChildren() {
        Array.from(document.body.children as any as HTMLElement[]).forEach((node) => {
            if (node.id !== RootElement) {
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
            this.app.classList.remove('ea-hidden')
            return
        }
    
        const originNode = document.querySelector(this.matchItem.body)
        this.titleNode = document.querySelector(this.matchItem.title)
        this.title = this.titleNode.textContent
        
        if (! originNode) {
            return
        }
    
        this.hiddenBodyAndChildren()

        mountNode.appendChild(simplify(originNode as unknown as HTMLElement, this.matchItem.config))
        ref.createContent(this.getContentData(mountNode))
        ref.title.textContent = this.getTitle()
        this.app.style.display = 'block'
    }

    private getTitle() {
        return this.title ? this.title : document.title
    }
    
    public restore() {
        const body = document.body
        
        if (body.hasAttribute('minWidth')) {
            body.style.minWidth = body.getAttribute('minWidth')!
        }
    
        const fragment = createFragment()
        this.cacheNodeList.forEach(node => fragment.appendChild(node))
        this.cacheNodeList = []
        body.insertBefore(fragment, this.root)
        this.app.classList.add('ea-hidden')
        this.root.classList.remove('active')
    }
} 