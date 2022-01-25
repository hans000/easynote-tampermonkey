
const config = {
    drop: ['meta', 'script', 'button', 'style', 'head', 'svg', 'noscript', 'link', 'form', 'canvas'],
    skip: ['pre'],
    block: ['p', 'ul', 'ol'],
    bare: ['div', 'span', 'figure', 'header', 'main', 'footer', 'article'],
    tasks: [
        { type: 'merge', selector: 'div.LabelContainer-wrapper', },
    ]
}

const getTagName = (node: HTMLElement) => node.tagName.toLowerCase()
const isSkipNode = (node: HTMLElement) => isElementNode(node) ? config.skip.includes(getTagName(node)) : false
const isDropNode = (node: HTMLElement) => isElementNode(node) ? config.drop.includes(getTagName(node)) : true
const isBareNode = (node: HTMLElement) => config.bare.includes(getTagName(node))
const isBlockNode = (node: HTMLElement) => config.block.includes(getTagName(node))
const isTextNode = (node: HTMLElement) => node.nodeType === 3
const isElementNode = (node: HTMLElement) => node.nodeType === 1
const isFragmentNode = (node: HTMLElement) => node.nodeType === 11
const createFragment = () => document.createDocumentFragment()

function handleSkipNode(node: HTMLElement) {
    // 处理skipNode, e.g. pre code
    const tagName = getTagName(node)
    if (tagName === 'pre') {
        const newNode = document.createElement('pre')
        newNode.innerHTML = node.innerText
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