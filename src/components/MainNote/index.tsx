import clsx from "clsx"
import { forwardRef } from "preact/compat"
import { Ref, useContext, useImperativeHandle, useRef, useState } from "preact/hooks"
import { AppContext } from "../../views/app"
import { Content, ContentProps } from "./Content"
import './index.less'

export interface MainNoteRef {
    title: HTMLElement
    article: HTMLElement
    createContent: (data: ContentProps[]) => void
}

export const MainNote = forwardRef((props, ref: Ref<MainNoteRef>) => {
    const [contentData, setContentData] = useState<ContentProps[]>([]);
    const { state } = useContext(AppContext)
    const articleRef = useRef()
    const titleRef = useRef()

    useImperativeHandle(
        ref,
        () => {
            return {
                title: titleRef.current,
                article: articleRef.current,
                createContent: (data) => {
                    setContentData(data)
                },
            }
        },
        []
    );
    
    return (
        <div class={
            clsx({
                'ea-article-body': true,
                'ea-content-fixed': state.contentFixed,
                'ea-content-fixed--left': state.contentPos === 'left',
                'ea-content-fixed--right': state.contentPos === 'right',
            })
        }>
            <h1 ref={titleRef} class="title"></h1>
            { !!contentData.length && <Content data={contentData} />}
            <article ref={articleRef}></article>
        </div>
    )
})

