import './index.less'
import { ButtonElement } from '../../tools/const'
import { useContext, useState } from 'preact/hooks'
import Icon from '../Icon'
import { AppContext } from '../../views/app'

interface IProps {
    onClick: () => void
}

export function CtrlPanel(props: IProps) {
    const { state, dispatch } = useContext(AppContext)
    return (
        <div style={{ display: state.booting ? 'none' : 'flex' }} className={ButtonElement}>
            <span>
                <Icon onClick={() => {
                    dispatch({ type: 'ToggleBoot' })
                    props.onClick()
                }} style={{ fontSize: 26, verticalAlign: -4, color: '#fff' }}>{'settings'}</Icon>
            </span>
        </div>
    )
}