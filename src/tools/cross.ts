
const config = [
    {
        pattern: "^(.+)$",
        body: "article",
        title: "h1",
    }
]

export function getResourceText(id: string) {
    return import.meta.env.PROD ? GM_getResourceText(id) : JSON.stringify(config)
}