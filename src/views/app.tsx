import { HoverMenu } from "../components/HoverMenu";
import { CtrlPanel } from "../components/CtrlPanel";
import { createContext, useEffect, useReducer, useRef } from 'preact/compat'
import { hasSelected } from "../tools";
import { MainNote, MainNoteRef } from "../components/MainNote";
import { GlobalVar } from "../main";
import { initSelect } from "../core/bookmark/reselect";
import { Beautify } from "../core/beautify";
import { initComment } from "../core/bookmark/comment";

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
    const appRef = useRef<HTMLDivElement>()
    const mainRef = useRef<MainNoteRef>()
    const firstRef = useRef(true)

    useEffect(
        () => {
            const root = GlobalVar.RootElement
            const hover = hoverRef.current
            const app = GlobalVar.AppElement = appRef.current

            GlobalVar.Beautify = new Beautify(root, app, GlobalVar.matchItem)

            app.querySelector('article').addEventListener('mouseup', (event) => {
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
            <div ref={appRef} id="ea-app">
                <MainNote ref={mainRef} />
            </div>
            <div id='ea-ctrl'>
                <HoverMenu onClick={handle} ref={hoverRef} onChange={() => {
                    const data = initComment(GlobalVar.AppElement, GlobalVar.matchItem)
                    console.log(data)
                    mainRef.current.createComment(data)
                }}/>
                <CtrlPanel onClick={() => {
                    const beautify = GlobalVar.Beautify
                    GlobalVar.running ? beautify.restore() : beautify.run(mainRef.current)
                    GlobalVar.running = !GlobalVar.running

                    if (firstRef.current) {
                        firstRef.current = false
                        initSelect(GlobalVar.AppElement, GlobalVar.matchItem, handle)
                        const data = initComment(GlobalVar.AppElement, GlobalVar.matchItem)
                        mainRef.current.createComment(data)
                    }
                }} />
            </div>
        </AppContext.Provider>
    )
}
