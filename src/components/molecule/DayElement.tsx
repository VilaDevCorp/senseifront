import moment from 'moment';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SizeEnum } from '../../types/types';
import { Task } from '../../types/entities';
import { conf } from './../../conf'
import { TaskArea } from '../organism/TaskArea';
import { VilaButtonIcon } from '../ui/VilaButtonIcon';
import { SelectActivityModal } from '../organism/SelectActivityModal';
import { VilaIcon } from '../ui/VilaIcon';


const getWeekdayLabel = (date: Date) => {
    const weekDayNumber = moment(date).get('weekday')

    switch (weekDayNumber) {
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
        case 6:
            return 'Saturday'
        case 0:
            return 'Sunday'
        default:
            return ''
    }
}

export function DayElement({ date, tasks, selectedTasks, setSelectedTasks, onCreateTask }: {
    date: Date, tasks: Task[], selectedTasks: string[],
    setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>, onCreateTask: () => void
}) {

    const hasSelected = tasks.some((task) => selectedTasks.includes(task.id))

    return (
        <div className={`flex flex-col w-full min-w-[150px] grow basis-0 [&:last-child]:border-r-0 
            [&:last-child]:rounded-r-lg [&:last-child]:rounded-br-lg [&:first-child]:rounded-tl-lg [&:first-child]:rounded-bl-lg hover:opacity-100 
            ${hasSelected ? 'opacity-100' : 'opacity-70'} } `}>
            <div className={`flex w-full flex-col items-center justify-center h-[80px] z-[3] py-2`}>
                {getWeekdayLabel(date)}
                <div className={`flex w-full justify-center`}>{date.getDate()}</div>
            </div>
            <TaskArea tasks={tasks} selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} />
            <button className={`flex-col rounded-lg outline-none text-4xl transition-all hover:text-6xl 
                flex justify-center hover:bg-background-300 hover:border-success border border-transparent items-center grow min-h-[50px] h-max z-[3] w-full text-secondary-300
                hover:text-success`}
                onClick={() => onCreateTask()}>
                <VilaIcon type={'add'} />
            </button>
        </div >
    )
}