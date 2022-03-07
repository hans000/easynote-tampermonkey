import CommentItem from "../CommentItem";

export interface CommentData {
    title: string
    comment: string
    uid: string
    type: number
}

interface IProps {
    data: CommentData[]
}

export default function Comment(props: IProps) {
    return (
        <div>
            {
                props.data.map(item => {
                    return (
                        <CommentItem key={item.uid} {...item} />
                    )
                })
            }
        </div>
    )
}