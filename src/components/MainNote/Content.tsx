export interface ContentProps {
    hash: string
    text: string
    class: string
}

interface IProps {
    data: ContentProps[]
}

export function Content(props: IProps) {
    return (
        <dl className="content">
            <dt>目录</dt>
            {
                props.data.map(item => (
                    <dd className={item.class}>
                        <a href={item.hash}>{item.text}</a>
                    </dd>
                ))
            }
        </dl>
    )
}