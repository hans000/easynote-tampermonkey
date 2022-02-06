import { forwardRef } from 'preact/compat'
import { Ref, useEffect, useState } from 'preact/hooks'
import { bare, highlight } from '../../core/bookmark/highlight'
import { update } from '../../core/bookmark/reselect'
import { GlobalVar } from '../../main'
import { HoverElement } from '../../tools/const'
import './index.less'

const colors = ['#fff066', '#7df066', '#74eaff', '#f799d1', '#eb4949']

interface IProps {
    onClick: (activeMarks: HTMLElement[], event: Event) => void
    activeMarks: HTMLElement[]
}

export const HoverMenu = forwardRef((props: IProps, ref: Ref<HTMLDivElement>) => {
    const [value, setValue] = useState(0)

    useEffect(
        () => {
            const mark = props.activeMarks[0]
            if (mark) {
                setValue(+mark.getAttribute('type'))
            }
        },
        [props.activeMarks]
    )

    return (
        <div ref={ref} className={HoverElement}>
            <div class='color-cont'>
                {
                    colors.map((color, index) => {
                        const cls = ['color-tile']
                        if (index === value) {
                            cls.push('active')
                        }
                        return (
                            <button onClick={(event) => {
                                event.preventDefault()
                                setValue(index)
                                if (props.activeMarks.length) {
                                    props.activeMarks.forEach(mark => {
                                        mark.setAttribute('type', index + '')
                                        update(GlobalVar.AppElement, GlobalVar.matchItem)
                                    })
                                } else {
                                    highlight(GlobalVar.AppElement, GlobalVar.matchItem, index, props.onClick)
                                }
                            }} style={{ backgroundColor: color }} class={cls.join(' ')}></button>
                        )
                    })
                }
                {
                    !!props.activeMarks.length && (
                        <button title='删除' className="color-tile color-remove" onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            props.activeMarks.forEach(bare)
                            update(GlobalVar.AppElement, GlobalVar.matchItem)
                        }}>×</button>
                    )
                }
            </div>
        </div>
    )
})