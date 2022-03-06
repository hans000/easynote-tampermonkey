import clsx from "clsx"
import { forwardRef } from "preact/compat"
import { Ref, useContext, useImperativeHandle, useRef, useState } from "preact/hooks"
import { AppContext } from "../../views/app"
import Comment, { CommentData } from "./Comment"
import { Content, ContentProps } from "./Content"
import './index.less'

export interface MainNoteRef {
    title: HTMLElement
    article: HTMLElement
    createContent: (data: ContentProps[]) => void
    createComment: (data: CommentData[]) => void
}

export const MainNote = forwardRef((props, ref: Ref<MainNoteRef>) => {
    const [contentData, setContentData] = useState<ContentProps[]>([]);
    const { state } = useContext(AppContext)
    const articleRef = useRef()
    const titleRef = useRef()
    const [commmentData, setCommentData] = useState<CommentData[]>([])

    useImperativeHandle(
        ref,
        () => {
            return {
                title: titleRef.current,
                article: articleRef.current,
                createContent: setContentData,
                createComment: setCommentData,
            }
        },
        []
    );
    
    return (
        <div className="ea-app">
            <div id="ea-main" class={
                clsx({
                    'ea-content-fixed': state.contentFixed,
                    'ea-content-fixed--left': state.contentPos === 'left',
                    'ea-content-fixed--right': state.contentPos === 'right',
                })
            }>
                <div className="ea-comment">
                    <Comment data={commmentData} />
                </div>
                <h1 ref={titleRef} class="title"></h1>
                { !!contentData.length && <Content data={contentData} />}
                <article ref={articleRef}></article>
            </div>
        </div>
    )
})

