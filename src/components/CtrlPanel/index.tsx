import './index.less'
import { ButtonElement } from '../../tools/const'

interface IProps {
    onClick: () => void
}

export function CtrlPanel(props: IProps) {
    return (
        <div className={ButtonElement} onClick={props.onClick}>切换</div>
    )
}