import clsx from "clsx";
import { useContext, useMemo, useState } from "preact/hooks";
import { ContentDefaultPos } from "../../tools/const";
import { AppContext } from "../../views/app";

export interface ContentProps {
    hash: string
    text: string
    class: string
}

interface IProps {
    data: ContentProps[]
}

export function Content(props: IProps) {
    const { state, dispatch } = useContext(AppContext)

    const isLeft = useMemo(() => state.contentPos === 'left', [state.contentPos])

    return (
        <aside className={clsx({
            content: true,
            'content__fixed': state.contentFixed,
            'content__fixed--left': isLeft,
            'content__fixed--right': !isLeft,
        })}>
            <dl>
                <dt>
                    <span>目录</span>
                    <span className='btn' style={{ verticalAlign: '.1em' }} onClick={() => {
                        dispatch({ type: 'UpdateContentPos', payload: state.contentFixed ? undefined : ContentDefaultPos })
                        dispatch({ type: 'ToggleContextFixed' })
                    }}>📌</span>
                    {
                        state.contentFixed && <span className='btn' style={{ verticalAlign: '.2em' }} onClick={() => dispatch({ type: 'UpdateContentPos', payload: isLeft ? 'right' : 'left' })}>{isLeft ? '👉' : '👈'}</span>
                    }
                </dt>
                {
                    props.data.map(item => (
                        <dd className={item.class}>
                            <a href={item.hash} title={item.text}>{item.text}</a>
                        </dd>
                    ))
                }
            </dl>
        </aside>
    )
}