import { forwardRef } from "preact/compat"
import { Ref, useImperativeHandle, useRef, useState } from "preact/hooks"
import { Content, ContentProps } from "./Content"

export interface MainNoteRef {
    title: HTMLElement
    article: HTMLElement
    createContent: (data: ContentProps[]) => void
}

export const MainNote = forwardRef((props, ref: Ref<MainNoteRef>) => {
    const articleRef = useRef()
    const titleRef = useRef()
    
    const [contentData, setContentData] = useState<ContentProps[]>([]);

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
        <div class="article-body">
            <h1 ref={titleRef} class="title"></h1>
            <Content data={contentData} />
            <article ref={articleRef}></article>
        </div>
    )
})

