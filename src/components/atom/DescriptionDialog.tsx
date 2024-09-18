import { useEffect, useRef, useState } from 'react';
import { useDescriptionDialog } from '../../hooks/useDescriptionDialog';

export function DescriptionDialog({ inModal }: { inModal?: boolean }) {

    const dialogBox = useRef(null)
    const { modalText, text, event } = useDescriptionDialog()

    const [top, setTop] = useState<number>(0)
    const [left, setLeft] = useState<number>(0)
    const [invertedX, setInvertedX] = useState<boolean>(false)
    const [invertedY, setInvertedY] = useState<boolean>(false)

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (event) {
            const { clientX, clientY } = event
            setTop(clientY)
            setLeft(clientX)
            if (window.innerWidth - clientX < 300) {
                setInvertedX(true)
            } else {
                setInvertedX(false)
            }
            if (clientY > window.innerHeight / 2) {
                setInvertedY(true)
            } else {
                setInvertedY(false)
            }
        } else {
            setTop(0)
            setLeft(0)
            setInvertedX(false)
            setInvertedY(false)
        }
        setVisible(!!(inModal && modalText || !inModal && text))
    }, [event])


    return (
        <>
            {visible &&
                <article ref={dialogBox} style={{ maxWidth: window.screen.width / 2 - 20, top: top, left: left + (invertedX ? -20 : 20) }} className={`fixed bg-modalTransparent p-4
                flex flex-col z-10 mt-4 w-[300px] rounded-lg backdrop-blur-sm ${invertedX && '-translate-x-full'} ${invertedY && '-translate-y-full'}`}>
                    <p className='w-full text-lightFont-200 h-full overflow-auto'>{inModal ? modalText : text}</p>
                </article>}
        </>
    )
}