import './index.less'
import { MarkElement } from "../../tools/const"
import { hasSelected } from "../../tools/hasSelected"
import { update } from "./reselect"
import { MatchItem } from '../base/config'

interface MarkToken {
    start?: number
    end?: number
    id?: string
    node: HTMLElement
}

function createMarkNode(text: string, id: string = Date.now() + '') {
    const mark = document.createElement(MarkElement)
    mark.textContent = text
    mark.dataset.id = id
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

export function wrap(token: MarkToken) {
    const { start, end, node, id } = token
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

    parent.insertBefore(createMarkNode(mid, id), node)

    if (right) {
        parent.insertBefore(document.createTextNode(right), node)
    }

    node.remove()
}

export function highlight(matchItem: MatchItem) {
    const list = walk()

    if (list) {
        list.forEach(token => wrap(token))
        update(matchItem)
        window.getSelection()!.removeAllRanges()
    }
}
