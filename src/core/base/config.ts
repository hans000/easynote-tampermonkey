import { SimplifyConfig } from './../simplify/index';
export interface ConfigProps {
    pattern: string
    selector: string
    config?: SimplifyConfig
}

export interface TaskToken {
    type: 'drop'
    selectors: string[]
    queryAll?: boolean
}

// const configList: ConfigProps[] = [
//     {
//         pattern: '^https://zhuanlan.zhihu.com/p/(\\d+)',
//         selector: 'article.Post-Main'
//     },
//     {
//         pattern: '^https://juejin.cn/post/(\\d+)',
//         selector: 'article.article',
//         config: {
//             tasks: [
//                 { type: 'drop', selectors: ['.tag-list-box', '.author-info-block', '.column-container', '.extension-banner'] }
//             ]
//         }
//     },
//     {
//         pattern: '^https://blog.csdn.net/(?:.+)/article/details/(\\d+)',
//         selector: '.blog-content-box',
//         config: {
//             skip: {
//                 pre: {
//                     drop: ['.hljs-ln-numbers'],
//                     wrap: ['.hljs-ln-line', 'br'],
//                     text: ['span'],
//                 }
//             },
//             tasks: [
//                 { type: 'drop', selectors: ['.article-info-box', '.recommendDown'] }
//             ]
//         }
//     },
//     {
//         pattern: '^https://www.cnblogs.com/(?:.+)/p/(\\d+)',
//         selector: '#topics',
//     },
// ]

export interface MatchItem {
    aid: string
    selector: string
    config?: SimplifyConfig
}

export function matched(url: string): MatchItem | undefined {
    try {
        const configList = JSON.parse(GM_getResourceText('config'))
        for (const config of configList) {
            const reg = new RegExp(config.pattern)
            const match = reg.exec(url)

            if (match) {
                return {
                    aid: match[1],
                    selector: config.selector,
                    config: config.config
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}