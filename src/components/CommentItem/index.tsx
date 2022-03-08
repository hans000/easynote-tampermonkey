import { useEffect, useRef, useState } from 'preact/hooks'
import { updateComment } from '../../core/bookmark/comment'
import { queryMarks } from '../../core/bookmark/highlight'
import { GlobalVar } from '../../main'
import { clsx, inViewport } from '../../tools'
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
    const nodesRef = useRef<HTMLElement[]>([])
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

    function toNode(node: HTMLElement) {
        if (! inViewport(node)) {
            window.scrollTo({
                top: node.offsetTop,
                behavior: 'smooth',
            })
        }
    }

    return (
        <div className="ea-comment-item">
            <div style={{ backgroundColor: MarkColors[props.type] }} className={clsx({
                title: true,
                'title--fold': fold,
            })} title={props.title}>
                <span className='text' onClick={() => {
                    if (! nodesRef.current.length) {
                        nodesRef.current = queryMarks(props.uid)
                    }
                    const node = nodesRef.current[0]
                    toNode(node)
                }}>{props.title}</span>
                <span className={clsx({
                    icon: true,
                    'icon--rotate': fold
                })} onClick={() => {
                    if (! nodesRef.current.length) {
                        nodesRef.current = queryMarks(props.uid)
                    }
                    
                    setFold(fold => !fold)
                }}>＞</span>
            </div>
            {
                <textarea
                    style={{ display: fold ? 'none' : 'block' }} rows={3} className='comment'
                    onFocus={() => {
                        const node = nodesRef.current[0]
                        toNode(node)
                        nodesRef.current.forEach(node => node.classList.add('mark-focus'))
                    }} onBlur={() => {
                        nodesRef.current.forEach(node => node.classList.remove('mark-focus'))
                    }}
                    value={comment} onChange={handleChange}></textarea>
            }
        </div>
    )
}