// ==UserScript==
// @name         Easy Note v2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Easy Note v2
// @author       hans0000
// @match        https://*/*
// @grant        none
// ==/UserScript==
        
(function () {
    'use strict';

    var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

    var css$2 = "easynote {\n  z-index: 99999999;\n  position: fixed;\n  right: 24px;\n  bottom: 24px;\n  background-color: #fff;\n}\neasynote-hover {\n  z-index: 999999999;\n  position: fixed;\n  background-color: #fff;\n  box-shadow: #aaa 0 0 3px;\n}\n";
    n(css$2,{});

    const EasyNote = 'easynote';
    const MarkedHideElement = 'easynote-hidden';
    const RootElement = 'easynote-root';
    const MarkElement = 'easynote-mark';
    const HoverElement = 'easynote-hover';
    const StoreLocationKey = '__easynote-loc__';

    const config$1 = {
        drop: ['meta', 'script', 'button', 'style', 'head', 'svg', 'noscript', 'link', 'form', 'canvas'],
        skip: ['pre'],
        block: ['p', 'ul', 'ol'],
        bare: ['div', 'span', 'figure', 'header', 'main', 'footer', 'article'],
        tasks: [
            { type: 'merge', selector: 'div.LabelContainer-wrapper', },
        ]
    };
    const getTagName = (node) => node.tagName.toLowerCase();
    const isSkipNode = (node) => isElementNode(node) ? config$1.skip.includes(getTagName(node)) : false;
    const isDropNode = (node) => isElementNode(node) ? config$1.drop.includes(getTagName(node)) : true;
    const isBareNode = (node) => config$1.bare.includes(getTagName(node));
    const isBlockNode = (node) => config$1.block.includes(getTagName(node));
    const isTextNode = (node) => node.nodeType === 3;
    const isElementNode = (node) => node.nodeType === 1;
    const createFragment = () => document.createDocumentFragment();
    function handleSkipNode(node) {
        // 处理skipNode, e.g. pre code
        const tagName = getTagName(node);
        if (tagName === 'pre') {
            const newNode = document.createElement('pre');
            newNode.innerHTML = node.innerText;
            return newNode;
        }
        return node.cloneNode(true);
    }
    function handleTextNode(node) {
        const data = node.textContent.trim();
        return data ? document.createTextNode(data) : createFragment();
    }
    function createElement(node) {
        const tagName = getTagName(node);
        if (isBareNode(node)) {
            return createFragment();
        }
        const mount = document.createElement(tagName);
        if (tagName === 'img') {
            mount.src = node.src;
            mount.alt = node.alt;
        }
        if (tagName === 'a') {
            mount.href = node.href;
        }
        return mount;
    }
    function simplify(node, parent = null) {
        if (isTextNode(node))
            return handleTextNode(node);
        if (isSkipNode(node))
            return handleSkipNode(node);
        if (isDropNode(node))
            return createFragment();
        const mountNode = createElement(node);
        Array.from(node.childNodes).forEach(child => mountNode.appendChild(simplify(child, node)));
        if (isElementNode(mountNode) && isBlockNode(mountNode) && !mountNode.childNodes.length) {
            return createFragment();
        }
        return mountNode;
    }

    var css$1 = ".easynote-root {\n  max-width: 860px;\n  margin: 0 auto;\n  padding: 30px;\n  padding-bottom: 100px;\n  font-size: 16px;\n  -webkit-font-smoothing: antialiased;\n  font-family: \"Open Sans\", \"Clear Sans\", \"Helvetica Neue\", Helvetica, Arial, 'Segoe UI Emoji', sans-serif;\n  color: #333333;\n  line-height: 1.6;\n  background-color: #fff;\n}\n@media only screen and (min-width: 1400px) {\n  .easynote-root {\n    max-width: 1024px;\n  }\n}\n@media only screen and (min-width: 1800px) {\n  .easynote-root {\n    max-width: 1200px;\n  }\n}\n.easynote-root :root {\n  --side-bar-bg-color: #fafafa;\n  --control-text-color: #777;\n}\n.easynote-root img {\n  max-width: 100%;\n}\n.easynote-root a {\n  color: #4183C4;\n}\n.easynote-root h1,\n.easynote-root h2,\n.easynote-root h3,\n.easynote-root h4,\n.easynote-root h5,\n.easynote-root h6 {\n  position: relative;\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  font-weight: bold;\n  line-height: 1.4;\n  cursor: text;\n}\n.easynote-root h1:hover a.anchor,\n.easynote-root h2:hover a.anchor,\n.easynote-root h3:hover a.anchor,\n.easynote-root h4:hover a.anchor,\n.easynote-root h5:hover a.anchor,\n.easynote-root h6:hover a.anchor {\n  text-decoration: none;\n}\n.easynote-root h1 tt,\n.easynote-root h1 code {\n  font-size: inherit;\n}\n.easynote-root h2 tt,\n.easynote-root h2 code {\n  font-size: inherit;\n}\n.easynote-root h3 tt,\n.easynote-root h3 code {\n  font-size: inherit;\n}\n.easynote-root h4 tt,\n.easynote-root h4 code {\n  font-size: inherit;\n}\n.easynote-root h5 tt,\n.easynote-root h5 code {\n  font-size: inherit;\n}\n.easynote-root h6 tt,\n.easynote-root h6 code {\n  font-size: inherit;\n}\n.easynote-root h1 {\n  font-size: 2.25em;\n  line-height: 1.2;\n  border-bottom: 1px solid #eee;\n}\n.easynote-root h2 {\n  font-size: 1.75em;\n  line-height: 1.225;\n  border-bottom: 1px solid #eee;\n}\n.easynote-root h3 {\n  font-size: 1.5em;\n  line-height: 1.43;\n}\n.easynote-root h4 {\n  font-size: 1.25em;\n}\n.easynote-root h5 {\n  font-size: 1em;\n}\n.easynote-root h6 {\n  font-size: 1em;\n  color: #777;\n}\n.easynote-root p,\n.easynote-root blockquote,\n.easynote-root ul,\n.easynote-root ol,\n.easynote-root dl,\n.easynote-root table {\n  margin: 0.8em 0;\n}\n.easynote-root li,\n.easynote-root ol,\n.easynote-root dl {\n  list-style: initial;\n}\n.easynote-root li > ol,\n.easynote-root li > ul {\n  margin: 0 0;\n}\n.easynote-root > ul:first-child,\n.easynote-root > ol:first-child {\n  margin-top: 30px;\n}\n.easynote-root hr {\n  height: 2px;\n  padding: 0;\n  margin: 16px 0;\n  background-color: #e7e7e7;\n  border: 0 none;\n  overflow: hidden;\n  box-sizing: content-box;\n}\n.easynote-root li p.first {\n  display: inline-block;\n}\n.easynote-root ul,\n.easynote-root ol {\n  padding-left: 30px;\n}\n.easynote-root ul:first-child,\n.easynote-root ol:first-child {\n  margin-top: 0;\n}\n.easynote-root ul:last-child,\n.easynote-root ol:last-child {\n  margin-bottom: 0;\n}\n.easynote-root blockquote {\n  border-left: 4px solid #dfe2e5;\n  padding: 0 15px;\n  color: #777777;\n}\n.easynote-root blockquote blockquote {\n  padding-right: 0;\n}\n.easynote-root table {\n  padding: 0;\n  word-break: initial;\n}\n.easynote-root table tr {\n  border: 1px solid #dfe2e5;\n  margin: 0;\n  padding: 0;\n}\n.easynote-root table tr:nth-child(2n),\n.easynote-root thead {\n  background-color: #f8f8f8;\n}\n.easynote-root table th {\n  font-weight: bold;\n  border: 1px solid #dfe2e5;\n  border-bottom: 0;\n  margin: 0;\n  padding: 6px 13px;\n}\n.easynote-root table td {\n  border: 1px solid #dfe2e5;\n  margin: 0;\n  padding: 6px 13px;\n}\n.easynote-root table th:first-child,\n.easynote-root table td:first-child {\n  margin-top: 0;\n}\n.easynote-root table th:last-child,\n.easynote-root table td:last-child {\n  margin-bottom: 0;\n}\n.easynote-root code,\n.easynote-root tt {\n  border: 1px solid #e7eaed;\n  background-color: #f8f8f8;\n  border-radius: 3px;\n  padding: 0;\n  padding: 2px 4px 0px 4px;\n  font-size: 0.9em;\n}\n.easynote-root code {\n  background-color: #f3f4f4;\n  padding: 0 2px;\n  margin: 0 2px;\n}\n.easynote-root pre {\n  padding: 8px;\n  background-color: #f6f6f6;\n  border-radius: 4px;\n  font-family: consolas;\n  font-size: 0.9em;\n}\n@media print {\n  .easynote-root html {\n    font-size: 13px;\n  }\n  .easynote-root table,\n  .easynote-root pre {\n    page-break-inside: avoid;\n  }\n  .easynote-root pre {\n    word-wrap: break-word;\n  }\n}\n";
    n(css$1,{});

    var css = "easynote-mark {\n  background-color: gold;\n}\n";
    n(css,{});

    function hasSelected() {
        return !!getSelection().rangeCount && !getSelection().isCollapsed;
    }

    function getSegmentUrl() {
        return location.href.slice(location.origin.length + 1);
    }

    function getLocation(node, root = document.body) {
        const list = [];
        let current = node;
        while (current && root !== current) {
            let index = 0;
            while (current.previousElementSibling) {
                current = current.previousElementSibling;
                index++;
            }
            list.push(index);
            current = current.parentNode;
        }
        return list;
    }
    function getTargetNode(position, root = document.body) {
        let current = root;
        while (position.length) {
            const index = position.pop();
            current = current.children[index];
        }
        return current;
    }
    function reselect(token) {
        const { l: [loc1, loc2], o: [startOffset, endOffset] } = token;
        const startContainer = getTargetNode(loc1);
        const endContainer = getTargetNode(loc2);
        const range = new Range();
        range.setStart(startContainer.firstChild, startOffset);
        range.setEnd(endContainer.firstChild, endOffset);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
    }
    function getLocationToken() {
        const range = getSelection().getRangeAt(0);
        const ll = getLocation(range.startContainer.parentElement);
        const lr = getLocation(range.endContainer.parentElement);
        const s = range.startOffset;
        const e = range.endOffset;
        return { l: [ll, lr], o: [s, e], };
    }
    function update() {
        var _a, _b;
        try {
            const obj = (_a = JSON.parse(localStorage.getItem(StoreLocationKey))) !== null && _a !== void 0 ? _a : {};
            const segment = getSegmentUrl();
            const tokens = (_b = obj[segment]) !== null && _b !== void 0 ? _b : [];
            const token = getLocationToken();
            tokens.push(token);
            localStorage.setItem(StoreLocationKey, JSON.stringify(Object.assign(Object.assign({}, obj), { [segment]: tokens })));
        }
        catch (error) {
            console.log(error);
        }
    }
    function initSelect() {
        var _a, _b;
        try {
            const obj = (_a = JSON.parse(localStorage.getItem(StoreLocationKey))) !== null && _a !== void 0 ? _a : {};
            const segment = getSegmentUrl();
            const tokens = (_b = obj[segment]) !== null && _b !== void 0 ? _b : [];
            tokens.forEach(token => {
                reselect(token);
                highlight(true);
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    function createMarkNode(text) {
        const mark = document.createElement(MarkElement);
        mark.textContent = text;
        return mark;
    }
    function walk() {
        if (!hasSelected()) {
            return;
        }
        const list = [];
        const { startContainer, startOffset, endContainer, endOffset } = getSelection().getRangeAt(0);
        const root = startContainer;
        let current = startContainer;
        while (true) {
            if (current.nodeType === 3) {
                list.push({ node: current });
            }
            if (current === endContainer) {
                list[0].start = startOffset;
                list[list.length - 1].end = endOffset;
                return list;
            }
            if (current === null) {
                return list;
            }
            if (current.firstChild) {
                current = current.firstChild;
                continue;
            }
            while (!current.nextSibling) {
                if (!current.parentNode || current.parentNode === root) {
                    return list;
                }
                current = current.parentNode;
            }
            current = current.nextSibling;
        }
    }
    function wrap(token) {
        const { start, end, node } = token;
        const parent = node.parentNode;
        let left = '';
        let right = '';
        let mid = node.textContent;
        let text = node.textContent;
        if (start) {
            left = text.slice(0, start);
            mid = text.slice(start);
        }
        if (end && end !== text.length) {
            mid = mid.slice(0, end - text.length);
            right = text.slice(end);
        }
        if (left) {
            parent.insertBefore(document.createTextNode(left), node);
        }
        parent.insertBefore(createMarkNode(mid), node);
        if (right) {
            parent.insertBefore(document.createTextNode(right), node);
        }
        node.remove();
    }
    function highlight(initial = false) {
        const list = walk();
        if (list) {
            if (!initial) {
                update();
            }
            list.forEach(token => wrap(token));
            window.getSelection().removeAllRanges();
        }
    }

    const config = [
        {
            url: 'https://zhuanlan.zhihu.com/p/',
            selector: 'article.Post-Main'
        },
        {
            url: 'https://juejin.cn/post/',
            selector: 'article.article'
        },
    ];
    function hidden() {
        Array.from(document.body.children).forEach((node) => {
            const tagName = node.tagName.toLowerCase();
            if (!['script', EasyNote, HoverElement].includes(tagName)) {
                node.style.display = 'none';
                node.setAttribute(MarkedHideElement, '');
            }
        });
    }
    function render(node) {
        const root = createRootNode();
        root.appendChild(simplify(node));
        document.body.appendChild(root);
    }
    function run() {
        var _a;
        const root = getRootElement();
        if (root) {
            hidden();
            root.style.display = 'block';
            return;
        }
        const item = config.find(item => window.location.href.startsWith(item.url));
        const originNode = document.querySelector((_a = item === null || item === void 0 ? void 0 : item.selector) !== null && _a !== void 0 ? _a : '');
        if (!originNode) {
            return;
        }
        hidden();
        render(originNode);
        initSelect();
    }
    function restore() {
        Array.from(document.body.children).forEach((node) => {
            if (node.getAttribute(MarkedHideElement) === '') {
                node.style.display = 'block';
            }
        });
        const root = getRootElement();
        root.style.display = 'none';
    }

    let __running = false;
    let __root;
    function getRootElement() { return __root; }
    function isRunning() { return __running; }
    function createCtrNode() {
        const panel = document.createElement(EasyNote);
        const btn = document.createElement('button');
        btn.addEventListener('click', () => {
            __running ? restore() : run();
            __running = !__running;
        });
        btn.innerText = 'run';
        panel.append(btn);
        document.body.append(panel);
    }
    function createHoverNode() {
        const hover = document.createElement(HoverElement);
        document.addEventListener('mouseup', (event) => {
            if (isRunning() && hasSelected()) {
                hover.style.display = 'block';
                hover.style.left = event.clientX + 'px';
                hover.style.top = event.clientY + 'px';
            }
        });
        document.body.addEventListener('mousedown', () => {
            hover.style.display = 'none';
        });
        const button = document.createElement('button');
        button.innerText = '高亮';
        button.addEventListener('mousedown', (e) => {
            highlight();
        });
        hover.appendChild(button);
        document.body.append(hover);
    }
    function createRootNode() {
        const root = document.createElement('div');
        __root = root;
        root.classList.add(RootElement);
        return root;
    }
    function init() {
        createCtrNode();
        createHoverNode();
    }

    init();

})();
