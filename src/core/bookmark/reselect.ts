import { getSegmentUrl } from "../../tools"
import { StoreLocationKey } from "../../tools/const"
import { highlight } from "./highlight"

interface LocationToken {
    l: [number[], number[]]
    o: [number, number]
}

function getLocation(node: HTMLElement, root = document.body) {
    const list = []
    let current: HTMLElement = node
    while (current && root !== current) {
        let index = 0
        while (current.previousElementSibling) {
            current = current.previousElementSibling as HTMLElement
            index++
        }
        list.push(index)
        current = current.parentNode as HTMLElement
    }
    return list
}

function getTargetNode(position: number[], root = document.body) {
    let current = root
    while (position.length) {
        const index = position.pop()!
        current = current.children[index] as HTMLElement
    }
    return current
}

function reselect(token: LocationToken) {
    const { l: [loc1, loc2], o: [startOffset, endOffset] } = token
    const startContainer = getTargetNode(loc1)
    const endContainer = getTargetNode(loc2)
    const range = new Range()

    range.setStart(startContainer.firstChild!, startOffset)
    range.setEnd(endContainer.firstChild!, endOffset)
    getSelection()!.removeAllRanges()
    getSelection()!.addRange(range)
}

function getLocationToken(): LocationToken {
    const range = getSelection()!.getRangeAt(0)
    const ll = getLocation(range.startContainer.parentElement!)
    const lr = getLocation(range.endContainer.parentElement!)
    const s = range.startOffset
    const e = range.endOffset

    return { l: [ll, lr], o: [s, e], }
}

export function update() {
    try {
        const obj: Record<string, LocationToken[]> = JSON.parse(localStorage.getItem(StoreLocationKey)!) ?? {}
        const segment = getSegmentUrl()
        const tokens = obj[segment] ?? []
        const token = getLocationToken()
        tokens.push(token)
        localStorage.setItem(StoreLocationKey, JSON.stringify({
            ...obj,
            [segment]: tokens
        }))
    } catch (error) {
        console.log(error);
    }
}

export function initSelect() {
    try {
        const obj: Record<string, LocationToken[]> = JSON.parse(localStorage.getItem(StoreLocationKey)!) ?? {}
        const segment = getSegmentUrl()
        const tokens = obj[segment] ?? []
        tokens.forEach(token => {
            reselect(token)
            highlight(true)
        })
    } catch (error) {
        console.log(error);
    }
}