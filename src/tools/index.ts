import { MarkElement } from "./const"

export const hasSelected = () => !!getSelection()!.rangeCount && !getSelection()!.isCollapsed

export const isTextNode = (node: HTMLElement) => node?.nodeType === 3
export const isElementNode = (node: HTMLElement) => node?.nodeType === 1
export const isFragmentNode = (node: HTMLElement) => node?.nodeType === 11
export const isMarkNode = (node: HTMLElement) => isElementNode(node) && getTagName(node) === MarkElement

export const getTagName = (node: Element) => node.tagName.toLowerCase()

export const createFragment = () => document.createDocumentFragment()
export const createTextNode = (text: string) => document.createTextNode(text)


export function isObject(value: any) {
    const type = typeof value
    return value !== null && (type === 'object' || type === 'function')
}

export function merge(source: any, other: any) {
    if (!isObject(source) || !isObject(other)) {
        return other === undefined ? source : other
    }
    return Object.keys({
        ...source,
        ...other
    }).reduce((acc: any, key) => {
        acc[key] = merge(source[key], other[key])
        return acc
    }, Array.isArray(source) ? [] : {})
}