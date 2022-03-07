import { StoreKey } from "../../tools/const";
import { MatchItem } from "../base/config";
import { queryMarks } from "./highlight";
import { Info } from "./reselect";

export function updateComment(app: HTMLElement, matchItem: MatchItem, uid: string, comment: string) {
    try {
        const obj: Record<string, Info[]> = JSON.parse(localStorage.getItem(StoreKey)!) ?? {}
        const aid = matchItem.aid
        const infoList = obj[aid] ?? []

        const newInfoList = [...infoList]
        newInfoList.find(info => info.uid === uid).comment = comment

        localStorage.setItem(StoreKey, JSON.stringify({
            ...obj,
            [aid]: newInfoList
        }))

    } catch (error) {
        console.log(error)
    }
}

export function initComment(app: HTMLElement, matchItem: MatchItem) {
    try {
        const obj: Record<string, Info[]> = JSON.parse(localStorage.getItem(StoreKey)!) ?? {}
        const aid = matchItem.aid
        const infoList = obj[aid] ?? []

        const uidCommentList = infoList.map(info => ({ uid: info.uid, comment: info.comment, type: info.type }))

        const data = uidCommentList.map(item => {
            return {
                title: Array.from(queryMarks(item.uid)).map(node => node.textContent).join(''),
                comment: item.comment,
                uid: item.uid,
                type: item.type,
            }
        })

        return data
    } catch (error) {
        console.log(error)
    }
}