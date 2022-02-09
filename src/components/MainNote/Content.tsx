import clsx from "clsx";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
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
            'ea-content': true,
            'ea-content__fixed': state.contentFixed,
            'ea-content__fixed--left': isLeft,
            'ea-content__fixed--right': !isLeft,
        })}>
            <dl>
                <dt>
                    <span>目录</span>
                    <span className='easynote-content__btn' style={{ verticalAlign: '.1em' }} onClick={() => {
                        dispatch({ type: 'UpdateContentPos', payload: state.contentFixed ? undefined : ContentDefaultPos })
                        dispatch({ type: 'ToggleContextFixed' })
                    }}>📌</span>
                    {
                        state.contentFixed && <span className='easynote-content__btn' style={{ verticalAlign: '.2em' }} onClick={() => dispatch({ type: 'UpdateContentPos', payload: isLeft ? 'right' : 'left' })}>{isLeft ? '👉' : '👈'}</span>
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