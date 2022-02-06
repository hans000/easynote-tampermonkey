import { MarkElement } from "../../tools/const"
import { hasSelected } from "../../tools/hasSelected"
import { update } from "./reselect"
import { MatchItem } from '../base/config'

interface MarkToken {
    start?: number
    end?: number
    uid?: string
    type?: number
    node: HTMLElement
}

function createMarkNode(text: string, uid: string, type: number) {
    const mark = document.createElement(MarkElement)
    mark.textContent = text
    mark.setAttribute('uid', uid)
    mark.setAttribute('type', type + '')
    return mark
}

export function walk() {
    if (! hasSelected()) {
        return
    }

    const list: MarkToken[] = []
    const { startContainer, startOffset, endContainer, endOffset } = getSelection()!.getRangeAt(0)
    const root = startContainer
    let current = startContainer

    while(true) {
        if (current.nodeType === 3) {
            list.push({ node: current as HTMLElement })
        }

        if (current === endContainer) {
            list[0].start = startOffset
            list[list.length - 1].end = endOffset
            return list
        }
        if(current === null) {
            return list
        }
        if (current.firstChild) {
            current = current.firstChild
            continue
        }
        while(! current.nextSibling) {
            if(!current.parentNode || current.parentNode === root) {
                return list
            }
            current = current.parentNode
        }
        current = current.nextSibling
    }
}

export function wrap(token: MarkToken, handle?) {
    const { start, end, node, uid, type } = token
    const parent = node.parentNode!

    let left = ''
    let right = ''
    let mid = node.textContent!
    let text = node.textContent!

    if (start) {
        left = text.slice(0, start)
        mid = text.slice(start)
    }

    if (end && end !== text.length) {
        mid = mid.slice(0, end - text.length)
        right = text.slice(end)
    }

    if (left) {
        parent.insertBefore(document.createTextNode(left), node)
    }

    const mark = createMarkNode(mid, uid!, type!)
    parent.insertBefore(mark, node)

    mark.addEventListener('click', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const activeMarks = document.querySelectorAll(`${MarkElement}[uid="${mark.getAttribute('uid')}"]`) as unknown as HTMLElement[]
        handle(activeMarks, ev)
    })

    if (right) {
        parent.insertBefore(document.createTextNode(right), node)
    }

    node.remove()
}

export function bare(node: HTMLElement) {
    const parent = node.parentNode as HTMLElement
    const previous = node.previousSibling as HTMLElement
    const next = node.nextSibling as HTMLElement

    const bothTextNode = (a: HTMLElement, b: HTMLElement) => (a && a.nodeType === 3 && b && b.nodeType === 3)

    const fragment = document.createDocumentFragment()
    Array.from(node.childNodes).forEach(child => {
        if (node.firstChild === child && bothTextNode(previous, child as HTMLElement)) {
            previous.textContent += child.textContent!
        } else if (node.lastChild === child && (bothTextNode(next, child as HTMLElement))) {
            next.textContent = child.textContent! + next.textContent!
        } else {
            fragment.appendChild(child)
        }
    })

    if (fragment.childNodes.length) {
        parent.insertBefore(fragment, node)
    } else {
        if (bothTextNode(previous, next)) {
            previous.textContent += next.textContent!
            next.remove()
        }
    }

    node.remove()
}

export function highlight(app: HTMLElement, matchItem: MatchItem, type: number, handle: any) {
    const list = walk()

    if (list) {
        const uid = Date.now() + ''
        list.forEach(token => wrap({ ...token, uid, type, }, handle))
        update(app, matchItem)
        window.getSelection()!.removeAllRanges()
    }
}
