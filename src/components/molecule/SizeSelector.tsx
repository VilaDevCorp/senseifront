import React from 'react';
import styled from 'styled-components';
import { stylesVars, ValueGradient } from '../../utils/stylesVars';

const sizeOptions: number[] = [
    1,
    2,
    3,
    4,
    5,
]

export function SizeSelector({ size, setSize, errorMsg }: {
    size: undefined | number, setSize: React.Dispatch<React.SetStateAction<undefined | number>>, errorMsg?: string
}) {

    return (
        <div className='flex gap-2 w-full flex-col'>
            <div className='flex gap-4 w-full'>
                {sizeOptions.map((sizeOption) =>
                    <div key={sizeOption} className={`w-[35px] h-[35px] flex justify-center text-darkFont-900 font-semibold items-center text-2xl cursor-pointer 
                    ${size === sizeOption ? ' opacity-100 ' : ' opacity-30 hover:opacity-60 '} rounded-full transition-all`}
                        style={{ border: `2px solid ${stylesVars.taskSize[sizeOption as keyof ValueGradient]}`, color: stylesVars.taskSize[sizeOption as keyof ValueGradient] }}
                        onClick={() => setSize(sizeOption)}>{sizeOption}</div>
                )}
            </div>
            <p className="text-error h-[14px]">{errorMsg}</p>
        </div >
    )
}