import html2md from "html-to-md"
import { useContext, useEffect, useMemo, useRef } from "preact/hooks"
import { GlobalVar } from "../../main"
import { download, withPrefix } from "../../tools"
import { AppContext } from "../../views/app"
import Icon from "../Icon"
import './index.less'

function getMarkdown() {
    return html2md(GlobalVar.AppElement.querySelector('#ea-main').outerHTML, {
        aliasTags: {
            'ea-mark': 'span'
        }
    })
}

export default function Header(props: {
    run: Function
}) {
    const { state, dispatch } = useContext(AppContext)

    const index = useMemo(() => {
        return state.mode === 'view' ? 1 : 2
    }, [state.mode])

    return (
        <div id="ea-header">
            <div className="logo">
                <img width={40} height={40} src={withPrefix(`/${index}.gif`)} />
                <span>EasyNote</span>
            </div>
            <div className="nav">
                {/* <Icon title='设置'>{'settings'}</Icon> */}
                <Icon title="复制markdown" onClick={() => {
                    navigator.clipboard.writeText(getMarkdown())
                }}>{'description'}</Icon>
                <Icon title='下载' onClick={() => {
                    download(getMarkdown(), document.title + '.md')
                }}>{'file_download'}</Icon>
                <Icon title='打印' onClick={() => {
                    print()
                }}>{'print'}</Icon>
                {
                    state.mode === 'view'
                        ? (
                            <Icon title="批注" onClick={() => {
                                dispatch({ type: 'UpdateMode', payload: 'edit' })
                            }}>{'edit'}</Icon>
                        )
                        : (
                            <Icon title="阅读" onClick={() => {
                                dispatch({ type: 'UpdateMode', payload: 'view' })
                            }}>{'visibility'}</Icon>
                        )
                }
                <Icon title="退出" onClick={() => {
                    props.run()
                    dispatch({ type: 'ToggleBoot' })
                }}>{'close'}</Icon>
            </div>
        </div>
    )
}