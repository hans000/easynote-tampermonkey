import { HoverMenu } from "../components/HoverMenu";
import { MainPanel } from "../components/CtrlPanel";
import { createContext, useEffect, useReducer, useRef } from 'preact/compat'
import { MatchItem } from "../core/base/config";
import { hasSelected } from "../tools/hasSelected";
import { Beautify } from "../core/beautify";
import './style.less'

type ActionType = 'ToggleRunning'

interface Action {
    type: ActionType
    payload?: any
}

export interface GlobalState {
    running: boolean
    beautify: Beautify
    matchItem: MatchItem
    rootElement: HTMLElement
    appElement: HTMLElement
}

const reducer = (state: GlobalState, action: Action) => {
    switch (action.type) {
        case 'ToggleRunning':
            return { ...state, running: !state.running }
        default:
            return state
    }
}

//@ts-ignore
export const AppContext = createContext<{ state: GlobalState, dispatch: (action: Action) => void }>({})

export function App(props: Omit<GlobalState, 'running'>) {
    const [state, dispatch] = useReducer<GlobalState, Action>(reducer, {
        running: false,
        beautify: props.beautify,
        matchItem: props.matchItem,
        appElement: props.appElement,
        rootElement: props.rootElement,
    })
    const hoverRef = useRef<HTMLDivElement>()

    useEffect(
        () => {
            const hover = hoverRef.current
            const handleMouseup = (event) => {
                event.preventDefault()
                if (state.running && hasSelected()) {
                    hover.style.display = 'block'
                    hover.style.left = event.clientX + 10 + 'px'
                    hover.style.top = event.clientY + 'px'
                }
            }
            const handleClick = () => {
                if (!state.running || !hasSelected()) {
                    hover.style.display = 'none'
                }
            }
            props.appElement.addEventListener('mouseup', handleMouseup)
            window.addEventListener('click', handleClick)
            return () => {
                props.appElement.removeEventListener('mouseup', handleMouseup)
                window.removeEventListener('click', handleClick)
            }
        },
        [state.running]
    )

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <HoverMenu ref={hoverRef} />
            <MainPanel />
            {/* {
                createPortal(<MainNote />, document.getElementsByTagName(AppElement)[0])
            } */}
        </AppContext.Provider>
    )
}
