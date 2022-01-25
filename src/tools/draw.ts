import { CanvasClassname } from "./const"

export interface Rect {
    left: number
    top: number
    width: number
    height: number
}

export function getContext() {
    const canvas = document.querySelector(CanvasClassname) as HTMLCanvasElement
    return canvas.getContext('2d')
}

export function drawRect(ctx: CanvasRenderingContext2D, rect: Rect) {
    ctx.beginPath()
    ctx.fillStyle = '#f8f50e57'
    ctx.fillRect(rect.left, rect.top, rect.width, rect.height)
    ctx.fill()
    ctx.closePath()
}