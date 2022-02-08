import { createFragment, getTagName, isElementNode, isTextNode } from "../../tools"
import { defalutConfig } from "./defaultConfig"

function matchNode(node: HTMLElement, selector = '') {
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

const isSkipNode = (node: HTMLElement) => isElementNode(node) ? Object.keys(defalutConfig.skip).some(item => matchNode(node, item)) : false
const isDropNode = (node: HTMLElement) => isElementNode(node) ? defalutConfig.drop.some(item => matchNode(node, item)) : true
const isBareNode = (node: HTMLElement) => defalutConfig.bare.some(item => matchNode(node, item))
const isBlockNode = (node: HTMLElement) => defalutConfig.block.some(item => matchNode(node, item))

function handlePreNode(node: HTMLElement, config: any): string {
    function handle(node: HTMLElement): string {
        if (node.nodeType === 3) return node.textContent ?? ''
        if (config.drop.some(item => matchNode(node, item))) return ''
  
        let text = Array.from(node.childNodes).map(child => handle(child as HTMLElement)).join('')
        text += (config.wrap.some(item => matchNode(node, item)) ? '\n' : '')
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
        const config = defalutConfig.skip[Object.keys(defalutConfig.skip).find(item => matchNode(node, item))!]
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

export function simplify(node: HTMLElement) {
    if (isTextNode(node)) return handleTextNode(node)
    if (isSkipNode(node)) return handleSkipNode(node)
    if (isDropNode(node)) return createFragment()

    const mountNode = createElement(node)

    Array.from(node.childNodes).forEach(child => mountNode.appendChild(simplify(child as HTMLElement)))

    if (isElementNode(mountNode) && isBlockNode(mountNode) && !mountNode.childNodes.length) {
        return createFragment()
    }

    return mountNode
}