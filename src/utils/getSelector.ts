export default function getSelector(textNode: HTMLElement, root = document.body) {
    let head = textNode
    const result = []

    while (head !== root) {
        const index = Array.from(head.parentNode!.childNodes).findIndex(node => node === head)
        result.push(index)
        head = head.parentNode as HTMLElement
    }

    return result
}