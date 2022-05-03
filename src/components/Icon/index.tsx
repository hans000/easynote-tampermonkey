import React, { Ref } from "preact/compat";
import { clsx } from "../../tools";
import './index.less'

interface IProps {
    className?: string
    style?: React.JSX.CSSProperties
    onClick?: () => void
    title?: string
}

export default React.forwardRef(
    (
        { className, ...props }: IProps,
        ref: Ref<HTMLSpanElement>
    ) => (
        <span
            {...props}
            ref={ref}
            className={clsx({
                'ea-icon': true,
                'material-icons': true,
                [className]: true
            })}
        />
    )
)