import { HoverMenu } from "../components/HoverMenu";
import { CtrlPanel } from "../components/CtrlPanel";
import { createContext, createPortal, useEffect, useReducer, useRef } from 'preact/compat'
import { hasSelected } from "../tools/hasSelected";
import { Beautify } from "../core/beautify";
import './style.less'
import { MainNote, MainNoteRef } from "../components/MainNote";
import { GlobalVar } from "../main";

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
                    hover.style.display = 'none'
                }
            })
        },
        []
    )

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <HoverMenu ref={hoverRef} />
            <CtrlPanel onClick={() => {
                const beautify = GlobalVar.Beautify
                GlobalVar.running ? beautify.restore() : beautify.run(mainRef.current)
                GlobalVar.running = !GlobalVar.running
            }} />
            { createPortal(<MainNote ref={mainRef} />, GlobalVar.AppElement) }
        </AppContext.Provider>
    )
}
