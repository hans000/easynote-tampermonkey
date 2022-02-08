export interface ConfigProps {
    pattern: string
    selector: string
	[key:string]: any
}

const configList: ConfigProps[] = [
    {
        pattern: '^https://zhuanlan.zhihu.com/p/(\\d+)',
        selector: 'article.Post-Main'
    },
    {
        pattern: '^https://juejin.cn/post/(\\d+)',
        selector: 'article.article'
    },
	{
		pattern: '^https://blog.csdn.net/(?:.+)/article/details/(\\d+)',
		selector: 'article',
	},
	{
		pattern: '^https://www.cnblogs.com/(?:.+)/p/(\\d+)',
		selector: '#topics',
	},
]

export interface MatchItem {
    aid: string
    selector: string
}

export function matched(url: string): MatchItem | undefined {
	for (const config of configList) {
		const reg = new RegExp(config.pattern)
		const match = reg.exec(url)

		if (match) {
			return {
				aid: match[1],
				selector: config.selector,
			}
		}
	}
}