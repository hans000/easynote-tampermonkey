import './index.less'
import { ButtonElement } from '../../tools/const'
import { useContext } from 'preact/hooks';
import { AppContext } from '../../views/app';

export function MainPanel() {
    const { state, dispatch } = useContext(AppContext)

    function handleClick() {
        state.running ? state.beautify.restore() : state.beautify.run()
        dispatch({ type: 'ToggleRunning' })
    }
    return (
        <div className={ButtonElement} onClick={handleClick}>切换</div>
    )
}