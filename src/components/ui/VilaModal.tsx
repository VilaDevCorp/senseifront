import { ReactNode, useEffect, useState } from 'react';
import { VilaButtonIcon } from './VilaButtonIcon';
import React from 'react';


export type ModalSize = 'xs' | 's' | 'm-longer' | 'm-squared' | 'm-fluid-h' | 'l' | 'xl' | 'xs-fluid-h'

const getSize = (size?: ModalSize): string => {
    switch (size) {
        case 'l':
            return 'md:!w-11/12 max-h-[1000px] max-w-[1500px]'
        case 'm-longer':
            return 'lg:w-2/5 sm:h-[600px] sm:max-w-[450px]'
        case 'm-squared':
            return 'w-3/4 md:max-h-[550px] max-w-[750px]'
        case 's':
            return 'w-1/2 max-h-600 max-w-1200'
        case 'm-fluid-h':
            return 'w-2/5 max-w-[600px]'
        case 'xs-fluid-h':
            return 'w-2/5 max-w-[600px]'
        default:
            return 'w-3/4 max-h-800 max-w-1600'
    }
}

type Props = {
    children: ReactNode
    size?: ModalSize
    hasHeader?: boolean
    onClose: () => void
    title?: string
    buttons?: JSX.Element[]
}

export function VilaModal(props: Props) {

    const closeWhenEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            props.onClose()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', closeWhenEscape)
        return () => {
            window.removeEventListener('keydown', closeWhenEscape)
        }
    }, [])

    return (
        <div className="w-full top-0 left-0 h-full md:h-screen  backdrop-blur-sm flex z-40 max-h-screen justify-center items-center fixed backdrop-contrast-75 " onClick={() => props.onClose()}>
            <div style={{ background: 'linear-gradient(120deg, rgba(6,15,20,1) 0%, rgba(19,43,55,1) 100%)' }} className={`relative flex rounded-lg h-full max-h-full sm:h-auto flex-col px-3 py-3 bg-background-900 ${getSize(props.size)} w-full `} onClick={(e) => e.stopPropagation()}>
                {props.hasHeader &&
                    <div className='flex w-full font-["Montserrat"] justify-between flex-row ml-auto items-center text-lightFont-500'>
                        {props.title}
                        <span className='ml-auto'><VilaButtonIcon size={'s'} buttonStyle={'transparent'} font='lightFont' icon='close' onClick={() => props.onClose()} />
                        </span>
                    </div>}
                <div className='overflow-y-auto px-2 mt-4 mb-4 py-2'>
                    {props.children}
                </div>
                <div className='self-end mt-auto flex gap-3 '>
                    {props.buttons?.map((button, index) =>
                        <React.Fragment key={index}>
                            {button}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div >
    )
}