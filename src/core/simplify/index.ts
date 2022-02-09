import { createFragment, createTextNode, getTagName, isElementNode, isTextNode, merge } from "../../tools"
import { TaskToken } from "../base/config"

export interface SimplifyConfig {
    drop?: string[]
    skip?: Record<string, { drop?: string[]; wrap?: string[]; text?: string[] }>
    block?: string[]
    bare?: string[]
    tasks?: TaskToken[]
}

export class Simplify {
    private static defaultConfig: SimplifyConfig = {
        drop: ['meta', 'script', 'button', 'style', 'head', 'svg', 'noscript', 'link', 'form', 'canvas', 'hr'],
        skip: {
            pre: {
                wrap: ['br'],
                text: ['span'],
                drop: [],
            },
        },
        block: ['p', 'ul', 'ol'],
        bare: ['div', 'span', 'figure', 'header', 'main', 'footer', 'article'],
        tasks: [],
    }

    private config: SimplifyConfig = {}

    constructor(config: SimplifyConfig) {
        this.config = merge(Simplify.defaultConfig, config)
    }

    private isSkipNode(node: HTMLElement) {
        return isElementNode(node)
            ? Object.keys(this.config.skip).some(item => Simplify.matchNode(node, item))
            : false
    }

    private isDropNode(node: HTMLElement) {
        return isElementNode(node)
            ? this.config.drop.some(item => Simplify.matchNode(node, item))
            : true
    }

    private isBareNode(node: HTMLElement) {
        return this.config.bare.some(item => Simplify.matchNode(node, item))
    }

    private isBlockNode(node: HTMLElement) {
        return this.config.block.some(item => Simplify.matchNode(node, item))
    }

    private static matchNode(node: HTMLElement, selector = '') {
        const match = /^([a-z][a-z0-9\-]*)?((?:\.[a-z][a-z0-9\-_]*)*)$/.exec(selector)
    
        if (match) {
            const [, tagname, classname] = match
    
            if (tagname && getTagName(node) !== tagname) {
                return false
            }
    
            if (classname) {
                const classList = classname.slice(1).split('.')
                return classList.every(classitem => node.classList.contains(classitem))
            }
    
            return !!(tagname || classname)
        }
    
        throw '`' + selector + '` is an invalid selector'
    }
    
    private static handlePreNode(node: HTMLElement, config: any): string {
        function handle(node: HTMLElement): string {
            if (node.nodeType === 3) return node.textContent ?? ''
            if (config.drop.some((item: string) => Simplify.matchNode(node, item))) return ''
    
            let text = Array.from(node.childNodes).map(child => handle(child as HTMLElement)).join('')
            text += (config.wrap.some((item: string) => Simplify.matchNode(node, item)) ? '\n' : '')
            return text
        }
    
        return handle(node)
    }

    private handleSkipNode(node: HTMLElement) {
        // 处理skipNode, e.g. pre code
        const tagName = getTagName(node)

        if (tagName === 'pre') {
            const newNode = document.createElement('pre')
            const config = this.config.skip[Object.keys(this.config.skip).find(item => Simplify.matchNode(node, item))!]
            const html = config ? Simplify.handlePreNode(node, config) : node.innerText
            newNode.innerHTML = html.replace(/</g, "&lt;").replace(/>/g, "&gt;")
            return newNode
        }

        return node.cloneNode(true)
    }

    private handleTextNode(node: HTMLElement) {
        const data = node.textContent!.trim()
        return data ? createTextNode(data) : createFragment()
    }
    
    private createElement(node: HTMLElement) {
        const tagName = getTagName(node)
        if (this.isBareNode(node)) {
            return createFragment()
        }

        const mount = document.createElement(tagName) as any
        if (tagName === 'img') {
            mount.src = (node as any).src
            mount.alt = (node as any).alt
        }
        if (tagName === 'a') {
            mount.href = (node as any).href
            mount.target = '_blank'
        }
        return mount
    }

    private runTasks(node: HTMLElement) {
        while (this.config.tasks.length) {
            const { type, selectors, queryAll } = this.config.tasks.shift()
            const query = queryAll ? node.querySelectorAll.bind(node) : node.querySelector.bind(node)
            if (type === 'drop') {
                selectors.forEach(selector => {
                    const nodeList = query(selector)
                    const newNodeList = queryAll ? nodeList : nodeList ? [nodeList] : []
                    ;(newNodeList as Element[]).forEach(node => node.remove())
                })
            }
        }
    }

    public exec(node: HTMLElement) {
        this.runTasks(node)

        if (isTextNode(node)) return this.handleTextNode(node)
        if (this.isSkipNode(node)) return this.handleSkipNode(node)
        if (this.isDropNode(node)) return createFragment()
    
        const mountNode = this.createElement(node)
    
        Array.from(node.childNodes).forEach(child => mountNode.appendChild(this.exec(child as HTMLElement)))
    
        if (isElementNode(mountNode) && this.isBlockNode(mountNode) && !mountNode.childNodes.length) {
            return createFragment()
        }
    
        return mountNode
    }
}