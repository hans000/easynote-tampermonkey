import { HoverMenu } from "../components/HoverMenu";
import { CtrlPanel } from "../components/CtrlPanel";
import { createContext, createPortal, useEffect, useReducer, useRef, useState } from 'preact/compat'
import { hasSelected } from "../tools";
import { MainNote, MainNoteRef } from "../components/MainNote";
import { GlobalVar } from "../main";
import './style.less'
import { initSelect } from "../core/bookmark/reselect";

type ActionType =
    | 'UpdateColorType'
    | 'UpdateActiveMarks'
    | 'ToggleContextFixed'
    | 'UpdateContentPos'

interface Action {
    type: ActionType
    payload?: any
}

export interface GlobalState {
    colorType: number
    activeMarks: HTMLElement[]
    contentFixed: boolean
    contentPos: 'left' | 'right' | undefined
}

const reducer = (state: GlobalState, action: Action) => {
    switch (action.type) {
        case 'UpdateColorType':
            return { ...state, colorType: action.payload ?? -1 }
        case 'UpdateActiveMarks':
            return { ...state, activeMarks: action.payload ?? [] }
        case 'ToggleContextFixed':
            return { ...state, contentFixed: !state.contentFixed }
        case 'UpdateContentPos':
            return { ...state, contentPos: action.payload }
        default:
            return state
    }
}

//@ts-ignore
export const AppContext = createContext<{ state: GlobalState, dispatch: (action: Action) => void }>({})

export function App() {
    const [state, dispatch] = useReducer<GlobalState, Action>(reducer, {
        colorType: -1,
        activeMarks: [],
        contentFixed: false,
        contentPos: undefined,
    })
    const hoverRef = useRef<HTMLDivElement>()
    const mainRef = useRef<MainNoteRef>()
    const firstRef = useRef(true)

    useEffect(
        () => {
            const hover = hoverRef.current
            GlobalVar.AppElement.querySelector('article').addEventListener('mouseup', (event) => {
                event.preventDefault()
                if (GlobalVar.running && hasSelected()) {
                    dispatch({ type: 'UpdateActiveMarks' })
                    dispatch({ type: 'UpdateColorType' })
                    hover.style.display = 'block'
                    hover.style.left = event.clientX + 10 + 'px'
                    hover.style.top = event.clientY + 'px'
                }
            })
            window.addEventListener('click', () => {
                if (!GlobalVar.running || !hasSelected()) {
                    dispatch({ type: 'UpdateActiveMarks' })
                    hover.style.display = 'none'
                }
            })
        },
        []
    )

    const handle = (activeMarks: HTMLElement[], event: MouseEvent) => {
        dispatch({ type: 'UpdateActiveMarks', payload: activeMarks })
        const hover = hoverRef.current
        hover.style.display = 'block'
        hover.style.left = event.clientX + 10 + 'px'
        hover.style.top = event.clientY + 'px'
    }

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <HoverMenu onClick={handle} ref={hoverRef} />
            <CtrlPanel onClick={() => {
                const beautify = GlobalVar.Beautify
                GlobalVar.running ? beautify.restore() : beautify.run(mainRef.current)
                GlobalVar.running = !GlobalVar.running

                if (firstRef.current) {
                    firstRef.current = false
                    initSelect(GlobalVar.AppElement, GlobalVar.matchItem, handle)
                }
            }} />
            { createPortal(<MainNote ref={mainRef} />, GlobalVar.AppElement) }
        </AppContext.Provider>
    )
}
