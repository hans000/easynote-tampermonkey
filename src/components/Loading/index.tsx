import { clsx } from '../../tools'
import './index.less'

export function Loading(props: {
    loading?: boolean
    style?: JSX.CSSProperties
    className?: string
    children?: JSX.Element
}) {
    return (
        <div className={clsx('ea-loading', props.className)} style={{ display: props.loading ? 'block' : 'none' }}>
            <div className='loading-cont'>
                {props.children}
            </div>
        </div>
    );
}
