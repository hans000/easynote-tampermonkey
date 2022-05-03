import CommentItem from "../CommentItem";
import Icon from "../Icon";

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
        <div className='ea-comment'>
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