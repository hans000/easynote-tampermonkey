import { MatchItem } from './../base/config';
import { MarkElement, StoreKey } from "../../tools/const"
import { wrap } from "./highlight"
import { getAppElement } from '..';

export interface LocationToken {
    l: number[]
    o: [number, number]
    id: string
}

function getTargetNode(position: number[], root = document.body) {
    let current = root
    while (position.length) {
        const index = position.shift()!
        current = current.childNodes[index] as HTMLElement
    }
    return current
}

export function getLocationTokens(node: HTMLElement) {
    const root = node
    const list: LocationToken[] = []
    const loc = []
    let current = node
    let offset = 0
    let index = 0
    let indexList = []

    const isMark = (node: HTMLElement) => node.nodeType === 1 && node.tagName.toLowerCase() === MarkElement
    const hasPreviousText = (node: HTMLElement) => node.previousSibling && node.previousSibling.nodeType === 3

    while(true) {
        if (isMark(current)) {
            const start = offset
            const end = start + current.textContent!.length
            const fact = hasPreviousText(current) ? -1 : 0

            const [, ...restLoc] = loc
            list.push({
                l: [...restLoc, index + fact],
                o: [start, end],
                id: current.dataset.id!,
            })
            offset = 0
        } else if (current.nodeType === 3) {
            offset += current.textContent!.length
        }

        if (current.firstChild) {
            loc.push(index)
            indexList.push(index)
            index = 0
            offset = 0
            current = current.firstChild as HTMLElement
            continue
        }
        while(! current.nextSibling) {
            if(!current.parentNode || current.parentNode === root) {
                return list
            }
            current = current.parentNode as HTMLElement
            loc.pop()
            offset = 0
            index = indexList.pop()!
        }
        
        current = current.nextSibling as HTMLElement
        index++
    }
}

export function update(matchItem: MatchItem) {
    try {
        const obj: Record<string, LocationToken[]> = JSON.parse(localStorage.getItem(StoreKey)!) ?? {}
        const uid = matchItem.uid
        const app = getAppElement()
        const tokens = getLocationTokens(app)
        localStorage.setItem(StoreKey, JSON.stringify({
            ...obj,
            [uid]: tokens
        }))
    } catch (error) {
        console.log(error);
    }
}

export function initSelect(matchItem: MatchItem) {
    try {
        const obj: Record<string, LocationToken[]> = JSON.parse(localStorage.getItem(StoreKey)!) ?? {}
        const uid = matchItem.uid
        const tokens = obj[uid] ?? []
        const app = getAppElement()
        tokens.forEach(pos => {
            const token = {
                node: getTargetNode(pos.l, app),
                start: pos.o[0],
                end: pos.o[1],
                id: pos.id,
            }
            wrap(token)
        })
    } catch (error) {
        console.log(error);
    }
}