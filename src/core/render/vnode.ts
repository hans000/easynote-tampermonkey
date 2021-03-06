import { NormalConfigProps, SkipConfigProps, VNode } from "."

const isTextNode = (node: HTMLElement) => node.nodeType === 3
const isElementNode = (node: HTMLElement) => node.nodeType === 1
const isDropNode = (node: HTMLElement, conf: NormalConfigProps) => (conf.drop || []).includes(getTagName(node))
const isKeepNode = (node: HTMLElement, conf: NormalConfigProps) => (conf.keep || []).includes(getTagName(node))
const isBareNode = (node: HTMLElement, conf: NormalConfigProps) => (conf.bare || []).includes(getTagName(node))
const getTagName = (node: HTMLElement) => node.tagName.toLowerCase()
const escape = (text: string) => text.replace(/</g, "&lt;").replace(/>/g, "&gt;")

const findSkipConf = (node: HTMLElement, conf: NormalConfigProps) => (Object.entries(conf.skip || {}).find(([selector]) => matchNode(node, selector)) || [])[1]

const matchNode = (node: HTMLElement, selector: string) => Array.from(node.parentNode.querySelectorAll(selector)).some(child => child === node)

export function toCode(node: HTMLElement, conf: SkipConfigProps) {
    const nodes: HTMLElement[] = conf.line.reduce((acc, selector) => (acc.push(...node.querySelectorAll(selector)), acc), [])

    const handle = (node: HTMLElement, conf: SkipConfigProps) => {
        if (isTextNode(node)) return node.textContent || ''
        if ((conf.drop || []).some((selector) => matchNode(node, selector))) return ''

        let text: string = Array.from(node.childNodes).map(child => handle(child as HTMLElement, conf)).join('')
        return text
    }

    if (! nodes.length) {
        return {
            type: 'pre',
            children: [ { text: node.textContent } ]
        }
    }

    const text = nodes.map(node => handle(node, conf)).filter(Boolean).join('\n')

    return {
        type: 'pre',
        children: [ { text: text } ]
    }
}

export function toVNode(node: HTMLElement, conf: NormalConfigProps, first = true): VNode {
    if (isTextNode(node)) return { text: node.textContent.trim() } as any
    if (isElementNode(node)) {
        if (isDropNode(node, conf)) return null

        const skipConf = findSkipConf(node, conf)
        if (skipConf) return toCode(node, skipConf)

        const children: VNode[] = []
        Array.from(node.childNodes).forEach((child) => {
            const childNode = toVNode(child as any, conf, false)
            const childList: VNode[] = Array.isArray(childNode) ? childNode : [childNode]
            childList.filter(Boolean).forEach(child => {
                if (children.length) {
                    let last = children[children.length - 1]
                    if (typeof last.text === 'string' && typeof child.text === 'string') {
                        children[children.length - 1].text += child.text
                    }
                }
                if (typeof child.text === 'string' && !!child.text || typeof child.type === 'string') {
                    children.push(child as VNode)
                }
            })
        })

        // if (! children.length) return

        if (isBareNode(node, conf)) {
            return first ? { children, type: '' } : children as any
        }

        const tagName = getTagName(node)
        return {
            type: tagName,
            children,
            ...(tagName === 'img' && { src: (node as HTMLImageElement).src }),
            ...(tagName === 'a' && { href: (node as HTMLAnchorElement).href }),
        }
    }
}
