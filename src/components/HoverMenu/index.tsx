import { forwardRef } from 'preact/compat'
import { Ref, useContext, useState } from 'preact/hooks'
import { highlight } from '../../core/bookmark/highlight'
import { HoverElement } from '../../tools/const'
import { AppContext } from '../../views/app'
import './index.less'

const charList = ['黄', '绿', '蓝', '粉', '红']
const colors = ['#fff066', '#7df066', '#74eaff', '#f799d1', '#eb4949']

export const HoverMenu = forwardRef((props: {}, ref: Ref<HTMLDivElement>) => {
    const { state } = useContext(AppContext)
    const [value, setValue] = useState(0)

    return (
        <div ref={ref} className={HoverElement}>
            <button onClick={(event) => {
                event.preventDefault()
                highlight(state.appElement, state.matchItem, value)
            }}>高亮</button>
            <select value={value} onChange={ev => {
                // @ts-ignore
                setValue(ev.target.value)
            }}>
                {
                    charList.map((char, index) => {
                        return (
                            <option style={{ backgroundColor: colors[index] }} value={index}>{char}</option>
                        )
                    })
                }
            </select>
        </div>
    )
})