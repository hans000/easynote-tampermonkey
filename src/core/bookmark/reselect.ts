import { isTextNode, isMarkNode } from './../../tools/index';
import { MatchItem } from './../base/config';
import { StoreKey } from "../../tools/const"
import { wrap } from "./highlight"

export interface Info {
    uid: string
    type: number
    tokens: LocationToken[]
}

export interface LocationToken {
    l: number[]
    o: [number, number]
    i: number
}

function getTargetNode(position: number[], root = document.body) {
    let current = root
    while (position.length) {
        const index = position.shift()!
        current = current.childNodes[index] as HTMLElement
    }
    return current
}

export function getInfoList(node: HTMLElement) {
    const mapInfo: Record<string, Info> = {}
    const root = node
    const loc = []
    let current = node
    let offset = 0
    let index = 0
    let indexList = []
    let renderIndex = 0

    while(true) {
        if (isMarkNode(current)) {
            const start = offset
            const end = start + current.textContent!.length
            const fact = isTextNode(current.previousSibling as HTMLElement) ? -1 : 0

            const uid = current.getAttribute('uid')!
            let info = mapInfo[uid]
            if (! info) {
                const type = +current.getAttribute('type')!
                info = mapInfo[uid] = {
                    uid,
                    type,
                    tokens: [],
                }
            }

            const [, ...restLoc] = loc
            info.tokens.push({
                l: [...restLoc, index + fact],
                o: [start, end],
                i: renderIndex++,
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
                return Object.values(mapInfo)
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

export function update(app: HTMLElement, matchItem: MatchItem) {
    try {
        const obj: Record<string, Info[]> = JSON.parse(localStorage.getItem(StoreKey)!) ?? {}
        const uid = matchItem.aid
        localStorage.setItem(StoreKey, JSON.stringify({
            ...obj,
            [uid]: getInfoList(app.querySelector('article'))
        }))
    } catch (error) {
        console.log(error);
    }
}

export function initSelect(app: HTMLElement, matchItem: MatchItem, handle) {
    try {
        const obj: Record<string, Info[]> = JSON.parse(localStorage.getItem(StoreKey)!) ?? {}
        const aid = matchItem.aid
        const infoList = obj[aid] ?? []

        const tokens = infoList
            .map(info => info.tokens.map(token => ({ ...token, uid: info.uid, type: info.type, })))
            .flat()
            .sort((a, b) => a.i - b.i)

        tokens.forEach(token => {
            wrap({
                node: getTargetNode(token.l, app.querySelector('article')),
                start: token.o[0],
                end: token.o[1],
                uid: token.uid,
                type: token.type,
            }, handle)
        })
    } catch (error) {
        console.log(error);
    }
}