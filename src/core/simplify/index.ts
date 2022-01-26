
const defalutConfig = {
    drop: ['meta', 'script', 'button', 'style', 'head', 'svg', 'noscript', 'link', 'form', 'canvas'],
    skip: {
        pre: {
            drop: ['.hljs-ln-numbers'],
            wrap: ['.hljs-ln-line'],
            text: ['span'],
        },
    },
    block: ['p', 'ul', 'ol'],
    bare: ['div', 'span', 'figure', 'header', 'main', 'footer', 'article'],
    tasks: [
        { type: 'merge', selector: 'div.LabelContainer-wrapper', },
    ]
}

const customConfig = {
    'https://blog.csdn.net/': {
        skip: {
            pre: {
                drop: ['.hljs-ln-numbers'],
                wrap: ['.hljs-ln-line'],
                text: ['span'],
            }
        }
    }
}

const getTagName = (node: HTMLElement) => node.tagName.toLowerCase()

function isSelectedNode(node: HTMLElement, selector = '') {
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

    throw '`' + selector + '` is not a valid selector'
}


const isSkipNode = (node: HTMLElement) => isElementNode(node) ? Object.keys(defalutConfig.skip).some(item => isSelectedNode(node, item)) : false
const isDropNode = (node: HTMLElement) => isElementNode(node) ? defalutConfig.drop.some(item => isSelectedNode(node, item)) : true
const isBareNode = (node: HTMLElement) => defalutConfig.bare.some(item => isSelectedNode(node, item))
const isBlockNode = (node: HTMLElement) => defalutConfig.block.some(item => isSelectedNode(node, item))
const isTextNode = (node: HTMLElement) => node.nodeType === 3
const isElementNode = (node: HTMLElement) => node.nodeType === 1
const isFragmentNode = (node: HTMLElement) => node.nodeType === 11
const createFragment = () => document.createDocumentFragment()

function handlePreNode(node: HTMLElement, config: any): string {
    function handle(node: HTMLElement): string {
        if (node.nodeType === 3) return node.textContent ?? ''
        if (isSelectedNode(node, config.drop)) return ''
  
        let text = Array.from(node.childNodes).map(child => handle(child as HTMLElement)).join('')
        text += (isSelectedNode(node, config.wrap) ? '\n' : '')
        return text
      }
  
    return handle(node)
}

function handleSkipNode(node: HTMLElement) {
    // 处理skipNode, e.g. pre code
    const tagName = getTagName(node)
    if (tagName === 'pre') {
        const newNode = document.createElement('pre')
        //@ts-ignore
        const config = defalutConfig.skip[Object.keys(defalutConfig.skip).find(item => isSelectedNode(node, item))!]
        const html = config ? handlePreNode(node, config) : node.innerText
        newNode.innerHTML = html.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        return newNode
    }
    return node.cloneNode(true)
}
function handleTextNode(node: HTMLElement) {
    const data = node.textContent!.trim()
    return data ? document.createTextNode(data) : createFragment()
}
function createElement(node: HTMLElement) {
    const tagName = getTagName(node)
    if (isBareNode(node)) {
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

export function simplify(node: HTMLElement, parent: HTMLElement | null = null) {
    if (isTextNode(node)) return handleTextNode(node)
    if (isSkipNode(node)) return handleSkipNode(node)
    if (isDropNode(node)) return createFragment()

    const mountNode = createElement(node)

    Array.from(node.childNodes).forEach(child => mountNode.appendChild(simplify(child as HTMLElement, node)))

    if (isElementNode(mountNode) && isBlockNode(mountNode) && !mountNode.childNodes.length) {
        return createFragment()
    }

    return mountNode
}