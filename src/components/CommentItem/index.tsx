import { useEffect, useState } from 'preact/hooks'
import { updateComment } from '../../core/bookmark/comment'
import { queryMarks } from '../../core/bookmark/highlight'
import { GlobalVar } from '../../main'
import { clsx } from '../../tools'
import { MarkColors } from '../HoverMenu'
import './index.less'

interface IProps {
    title: string
    comment: string
    uid: string
    type: number
}

export default function CommentItem(props: IProps) {
    const [fold, setFold] = useState(true)
    const [comment, setComment] = useState('')

    const handleChange = (ev: any) => {
        const comment = ev.target.value
        setComment(comment)
        updateComment(GlobalVar.AppElement, GlobalVar.matchItem, props.uid, comment)
    }

    useEffect(() => {
        if (props.comment !== comment) {
            setComment(props.comment)
        }
    }, [props.comment])

    return (
        <div className="ea-comment-item">
            <div style={{ backgroundColor: MarkColors[props.type] }} className={clsx({
                title: true,
                'title--fold': fold,
            })} title={props.title}>
                <span className='text' onClick={() => {
                    queryMarks(props.uid)[0].scrollIntoView()
                }}>{props.title}</span>
                <span className={clsx({
                    icon: true,
                    'icon--rotate': fold
                })} onClick={() => setFold(fold => !fold)}>＞</span>
            </div>
            {
                <textarea style={{ display: fold ? 'none' : 'block' }} value={comment} onChange={handleChange} rows={3} className='comment'></textarea>
            }
        </div>
    )
}