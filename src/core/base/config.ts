import { SimplifyConfig } from './../simplify/index';
export interface ConfigProps {
    pattern: string
    body?: string
    title?: string
    config?: SimplifyConfig
}

export interface TaskToken {
    type: 'drop'
    selectors: string[]
    queryAll?: boolean
}

export interface MatchItem {
    aid: string
    body: string
    title: string
    config?: SimplifyConfig
}

export function matched(url: string): MatchItem | undefined {
    try {
        const configList = JSON.parse(GM_getResourceText('config')) as ConfigProps[]
        for (const config of configList) {
            const reg = new RegExp(config.pattern)
            const match = reg.exec(url)

            if (match) {
                return {
                    aid: match[1],
                    body: config.body || 'article',
                    title: config.title || 'h1',
                    config: config.config
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}