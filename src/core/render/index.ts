import { merge } from "../../tools"
import { toVNode } from "./vnode"

export interface VNode {
    type?: string
    children?: VNode[]
    text?: string
    src?: string
    href?: string
}

export interface SkipConfigProps {
    type: 'code'
    line: string[]
    drop?: string[]
}

export interface NormalConfigProps {
    keep?: string[]
    bare?: string[]
    drop?: string[]
    skip?: Record<string, SkipConfigProps>
}

function createNode(props: VNode): HTMLElement {
    if (typeof props.text === 'string') {
        return document.createTextNode(props.text) as unknown as HTMLElement
    }
    if (props.type === '') {
        return document.createDocumentFragment() as unknown as HTMLElement
    }
    const node = document.createElement(props.type)
    switch (props.type) {
        case 'img':
            (node as HTMLImageElement).src = props.src
            return node
        case 'a':
            (node as HTMLAnchorElement).href = props.href
            return node
        // case 'pre':
        //     node.textContent = props.children[0].text
        //     return node
        default:
            return node;
    }
}

function render(props: VNode): HTMLElement {
    return (props.children || []).reduce(
        (node: HTMLElement, childProps) => {
            node.appendChild(render(childProps as VNode))
            return node
        },
        createNode(props) as HTMLElement
    )
}

const defaultConf: NormalConfigProps = {
    /**
     * del 删除线
     * strong b em 粗体
     * u 下划线
     * sub 下
     * sup 上
     * i 斜体
     */
    drop: [
        'meta', 'head', 'style', 'script', 'noscript', 'link', 'hr', 'br',
        'label', 'button', 'svg', 'iframe', 'form', 'input', 'nav', 'canvas', 'title'],
    skip: {},
    keep: ['p', 'dl', 'ul', 'ol', 'li', 'figcaption', 'caption', 'figure', 'cite'],
    bare: ['div', 'span', 'mark', 'summary', 'details', 'header', 'main', 'footer', 'article'],
}

export function simplify(node: HTMLElement, conf: NormalConfigProps) {
    const mergeConf = merge(defaultConf, conf)
    return render(toVNode(node, mergeConf))
}
