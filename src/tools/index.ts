export const hasSelected = () => !!getSelection()!.rangeCount && !getSelection()!.isCollapsed

export const isTextNode = (node: HTMLElement) => node?.nodeType === 3
export const isElementNode = (node: HTMLElement) => node?.nodeType === 1
export const isFragmentNode = (node: HTMLElement) => node?.nodeType === 11

export const getTagName = (node: Element) => node.tagName.toLowerCase()

export const createFragment = () => document.createDocumentFragment()
export const createTextNode = (text: string) => document.createTextNode(text)