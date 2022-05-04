import { MarkElement } from "./const"

export const hasSelected = () => !!getSelection()!.rangeCount && !getSelection()!.isCollapsed

export const isTextNode = (node: HTMLElement) => node?.nodeType === 3
export const isElementNode = (node: HTMLElement) => node?.nodeType === 1
export const isFragmentNode = (node: HTMLElement) => node?.nodeType === 11
export const isMarkNode = (node: HTMLElement) => isElementNode(node) && getTagName(node) === MarkElement

export const getTagName = (node: Element) => node.tagName.toLowerCase()

export const createFragment = () => document.createDocumentFragment()
export const createTextNode = (text: string) => document.createTextNode(text)

export function createDivNode(id: string) {
    const node = document.createElement('div')
    node.id = id
    return node
}

export function isObject(value: any) {
    const type = typeof value
    return value !== null && (type === 'object' || type === 'function')
}

export function merge(source: any, other: any) {
    if (!isObject(source) || !isObject(other)) {
        return other === undefined ? source : other
    }
    if (Array.isArray(source) && Array.isArray(other)) {
        return [...source, ...other]
    }
    return Object.keys({
        ...source,
        ...other
    }).reduce((acc: any, key) => {
        acc[key] = merge(source[key], other[key])
        return acc
    }, Array.isArray(source) ? [] : {})
}

export function clsx(...args: Array<Record<string, boolean> | string | null | undefined>) {
    return args.reduce<string[]>((acc, item) => {
        if (item) {
          if (typeof item === 'object') {
            Object.keys(item).forEach(key => {
              if (item[key]) {
                acc.push(key)
              }
            })
          } else {
            acc.push(item)
          }
        }
        return acc
    }, []).join(' ')
}

export function inViewport(node: HTMLElement) {
    const h = document.documentElement.clientHeight
    const t = node.getBoundingClientRect().top
    return t > 0 && t < h
}

export function withPrefix(src: string) {
    const branch = import.meta.env['VITE_BRANCH']
    return import.meta.env.DEV ? src : `https://raw.github.com/hans000/easynote-tampermonkey/${branch}/public` + src
}

export function download(content: string, filename: string) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content]))
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
    a.remove()
  }