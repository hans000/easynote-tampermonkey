export const defalutConfig = {
    drop: ['meta', 'script', 'button', 'style', 'head', 'svg', 'noscript', 'link', 'form', 'canvas'],
    skip: {
        pre: {
            drop: ['.hljs-ln-numbers'],
            wrap: ['.hljs-ln-line', 'br'],
            text: ['span'],
        },
    },
    block: ['p', 'ul', 'ol'],
    bare: ['div', 'span', 'figure', 'header', 'main', 'footer', 'article'],
    tasks: [
        { type: 'merge', selector: 'div.LabelContainer-wrapper', },
    ]
}

const customConfig = {
    'https://blog.csdn.net/': {
        skip: {
            pre: {
                drop: ['.hljs-ln-numbers'],
                wrap: ['.hljs-ln-line'],
                text: ['span'],
            }
        }
    }
}