
## TODO

-[] 目录
-[] 批注
-[] 校验失效的标记
-[] 双栏布局、对比
-[] 快捷键、do undo

## 问题
-[] 打印pdf的目录和书签
-[] 对于代码块 有内部滚动条提供配置选项  pre 里面用的是li https://blog.csdn.net/m0_37971327/article/details/78200113

```
// ==UserScript==
// @namespace yunyuyuan
// @name 隐藏知乎登录框&链接无缝跳转
// @description 隐藏烦人的知乎登录框，点击链接直接跳转不会提示有风险(谨慎操作)
// @match *://*.zhihu.com/*
// @version 0.0.1.20201202053300
// ==/UserScript==

(function (){
  'use strict';
  let timer, delay = 50

  function handle() {
    clearInterval(timer)
    timer = setInterval(() => {
      if (delay > 5000) clearInterval(timer)

      const modal = document.querySelector('.Modal-enter-done')
      if (modal) {
        document.documentElement.removeAttribute('style')
        clearInterval(timer)
        return modal.remove()
      }

      delay *= 2
    }, delay)
  }
  handle()
  document.addEventListener('click', (e)=>{
    let now = e.target;
    while (now) {
      if (now.tagName.toLowerCase() === 'a' && now.hasAttribute('href')) {
        checkIsZhihuLink(now.getAttribute('href'), e);
      }
      now = now.parentElement;
    }
  })
  const checkIsZhihuLink = (s, e)=> {
    const matcher = s.match(/https?:\/\/link\.zhihu\.com\/?\?target=(.+)$/);
    if (matcher) {
      e.stopPropagation();
      e.preventDefault();
      window.open(decodeURIComponent(matcher[1]));
    }
  }

})()


```
