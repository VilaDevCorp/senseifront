import React from 'react';
import styled from 'styled-components';
import { Task } from '../../types/entities';
import { ActivityIcon } from '../atom/ActivityIcon';
import { ValueGradient, stylesVars } from './../../utils/stylesVars'
import { VilaIcon } from '../ui/VilaIcon';
import { VilaButtonIcon } from '../ui/VilaButtonIcon';
import { useMisc } from '../../hooks/useMisc';

export function TaskElement({ task, selectedActivities, setSelectedActivities }: {
    task: Task, selectedActivities: string[],
    setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>>
}) {

    const {setShowDescription} = useMisc()

    const onSelect = () => {
        if (isSelected) {
            setSelectedActivities((old) => {
                const newValue = old.filter((element) => element !== task.id)
                return newValue
            }
            )
        } else {
            setSelectedActivities((old) => [task.id, ...old])
        }
    }
    const isSelected = selectedActivities.includes(task.id)
    return (
        <div className={`border-2 transition-all rounded-lg border-primary-900 bg-primary-400 opacity-80 min-h-[60px] overflow-hidden 
            cursor-pointer w-full flex items-center gap-2 px-2 py-1  ${task.completed ? ' !bg-success ' : ''}
            ${isSelected ? ' !opacity-100 !border-highlight brightness-125 ' : ''} hover:!opacity-100 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] `} onClick={() => onSelect()} >
            <div className='flex flex-col gap-2 justify-center items-center '>
                {task.edges.activity.icon !== undefined &&
                    <span className='text-2xl'>
                        <ActivityIcon type={task.edges.activity.icon} />
                    </span>}
                <span className={`border-2 font-bold flex w-[25px] h-[25px] items-center text-lg justify-center rounded-full`} style={{
                    borderColor: stylesVars.taskSize[task.edges.activity.size as keyof ValueGradient],
                    color: stylesVars.taskSize[task.edges.activity.size as keyof ValueGradient]
                }}>{task.edges.activity.size}</span>
                {task.edges.activity.description !== undefined &&
                    <span className='text-2xl'>
                        <VilaButtonIcon icon={'notes'} size='xs' onClick={(e)=>{setShowDescription(task.edges.activity.description);e.stopPropagation()}} />
                    </span>}

            </div>
            <div style={{ overflowWrap: 'anywhere' }}>
                {task.edges.activity.name}
            </div>
        </div>
    )
}