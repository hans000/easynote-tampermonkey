import { getResourceText } from '../../tools/cross';
import { NormalConfigProps } from '../render';
import localConfig from '../../../public/config.json'

export interface ConfigProps {
    pattern: string
    body?: string
    title?: string
    config?: NormalConfigProps
}

export interface MatchItem {
    aid: string
    body: string
    title: string
    config?: NormalConfigProps
}

export function matched(url: string): MatchItem | undefined {
    try {
        // load config.json
        const isLocal = import.meta.env.VITE_LOCAL

        const configList = (isLocal ? localConfig : JSON.parse(getResourceText('config'))) as ConfigProps[]
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