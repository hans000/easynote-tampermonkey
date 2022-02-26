import { merge } from "../../tools"
import { toVNode } from "./vnode"

export interface VNode {
    type?: string
    children?: VNode[]
    text?: string
    src?: string
    href?: string
    code?: string
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
        case 'pre':
            node.innerHTML = props.code
            return node
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
    drop: ['meta', 'script', 'button', 'style', 'head', 'svg', 'noscript', 'link', 'form', 'canvas', 'hr'],
    skip: {
        pre: {
            type: 'code',
            line: [],
            drop: [],
        },
    },
    keep: ['p', 'ul', 'ol'],
    bare: ['div', 'span', 'figure', 'header', 'main', 'footer', 'article'],
}

export function simplify(node: HTMLElement, conf: NormalConfigProps) {
    const mergeConf = merge(defaultConf, conf)
    return render(toVNode(node, mergeConf))
}
