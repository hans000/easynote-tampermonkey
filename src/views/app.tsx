import { HoverMenu } from "../components/HoverMenu";
import { CtrlPanel } from "../components/CtrlPanel";
import { createContext, createPortal, useEffect, useReducer, useRef, useState } from 'preact/compat'
import { hasSelected } from "../tools/hasSelected";
import { MainNote, MainNoteRef } from "../components/MainNote";
import { GlobalVar } from "../main";
import './style.less'
import { initSelect } from "../core/bookmark/reselect";

type ActionType = string

interface Action {
    type: ActionType
    payload?: any
}

export interface GlobalState {
}

const reducer = (state: GlobalState, action: Action) => {
    switch (action.type) {
        default:
            return state
    }
}

//@ts-ignore
export const AppContext = createContext<{ state: GlobalState, dispatch: (action: Action) => void }>({})

export function App() {
    const [state, dispatch] = useReducer<GlobalState, Action>(reducer, {})
    const hoverRef = useRef<HTMLDivElement>()
    const mainRef = useRef<MainNoteRef>()
    const firstRef = useRef(true)
    const [activeMarks, setActiveMarks] = useState<HTMLElement[]>([])

    // useEffect(
    //     () => {
    //         const handle = (event) => {
    //             setActiveMarks([])
    //         }
    //         window.addEventListener('select', handle)
    //         return () => {
    //             window.removeEventListener('mousemove', handle)
    //         }
    //     },
    //     [activeMarks]
    // )
    
    useEffect(
        () => {
            const hover = hoverRef.current
            GlobalVar.AppElement.addEventListener('mouseup', (event) => {
                event.preventDefault()
                if (GlobalVar.running && hasSelected()) {
                    hover.style.display = 'block'
                    hover.style.left = event.clientX + 10 + 'px'
                    hover.style.top = event.clientY + 'px'
                }
            })
            window.addEventListener('click', () => {
                if (!GlobalVar.running || !hasSelected()) {
                    setActiveMarks([])
                    hover.style.display = 'none'
                }
            })
        },
        []
    )

    const handle = (activeMarks: HTMLElement[], event: MouseEvent) => {
        setActiveMarks(activeMarks)
        const hover = hoverRef.current
        hover.style.display = 'block'
        hover.style.left = event.clientX + 10 + 'px'
        hover.style.top = event.clientY + 'px'
    }

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <HoverMenu activeMarks={activeMarks} onClick={handle} ref={hoverRef} />
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
