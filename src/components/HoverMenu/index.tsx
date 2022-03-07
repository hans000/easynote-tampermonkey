import { forwardRef } from 'preact/compat'
import { Ref, useContext, useEffect, useState } from 'preact/hooks'
import { bare, highlight } from '../../core/bookmark/highlight'
import { update } from '../../core/bookmark/reselect'
import { GlobalVar } from '../../main'
import { clsx } from '../../tools'
import { HoverElement } from '../../tools/const'
import { AppContext } from '../../views/app'
import './index.less'

export const MarkColors = ['#fff066', '#7df066', '#74eaff', '#f799d1', '#eb4949']

interface IProps {
    onClick: (activeMarks: HTMLElement[], event: MouseEvent) => void
    onChange?: () => void
}

export const HoverMenu = forwardRef((props: IProps, ref: Ref<HTMLDivElement>) => {
    const { state, dispatch } = useContext(AppContext)

    useEffect(
        () => {
            const mark = state.activeMarks[0]
            if (mark) {
                dispatch({
                    type: 'UpdateColorType',
                    payload: +mark.getAttribute('type'),
                })
            }
        },
        [state.activeMarks]
    )

    return (
        <div ref={ref} className={HoverElement}>
            <div class='color-cont'>
                {
                    MarkColors.map((color, index) => {
                        return (
                            <button onClick={(event) => {
                                event.preventDefault()
                                dispatch({
                                    type: 'UpdateColorType',
                                    payload: index,
                                })
                                if (state.activeMarks.length) {
                                    state.activeMarks.forEach(mark => {
                                        mark.setAttribute('type', index + '')
                                        update(GlobalVar.AppElement, GlobalVar.matchItem)
                                    })
                                } else {
                                    highlight(GlobalVar.AppElement, GlobalVar.matchItem, index, props.onClick)
                                }
                                props.onChange?.()
                            }} style={{ backgroundColor: color }} class={clsx({ 'color-tile': true, 'active': index === state.colorType })}></button>
                        )
                    })
                }
                {
                    !!state.activeMarks.length && (
                        <button title='删除' className="color-tile color-remove" onClick={(event) => {
                            event.preventDefault()
                            state.activeMarks.forEach(bare)
                            update(GlobalVar.AppElement, GlobalVar.matchItem)
                            props.onChange?.()
                        }}>×</button>
                    )
                }
            </div>
        </div>
    )
})