import { useNavigate } from 'react-router-dom';
import { useAuth, userDansAtom, weekCompletedPercentageAtom } from '../../hooks//useAuth';
import { VilaIcon } from '../ui/VilaIcon';
import { VilaButtonIcon } from '../ui/VilaButtonIcon';
import { CompletedPercentage } from '../atom/CompletedPercentage';
import { useRecoilValue } from 'recoil';
import { useEffect, useRef, useState } from 'react';


export function HeaderUser() {

    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const weekCompletedPercentage = useRecoilValue(weekCompletedPercentageAtom)
    const userDans = useRecoilValue(userDansAtom)

    const firstRender = useRef(true)
    const weekCompletedPercentageVal = useRef(weekCompletedPercentage)
    const userDansVal = useRef(userDans)




    const onLogout = async () => {
        logout()
        navigate('/login')
    }

    const [completedPercentage, setCompletedPercentage] = useState(weekCompletedPercentage)
    const [userDansState, setUserDansState] = useState(userDans)


    useEffect(() => {
        if (firstRender.current) {
            return
        }
        if (weekCompletedPercentage > weekCompletedPercentageVal.current) {
            incrementCompletedPercentage(weekCompletedPercentageVal.current)
        } else {
            decrementCompletedPercentage(weekCompletedPercentageVal.current)
        }
        weekCompletedPercentageVal.current = weekCompletedPercentage
    }, [weekCompletedPercentage])

    useEffect(() => {
        if (firstRender.current) {
            return
        }
        if (userDans > userDansVal.current) {
            incrementUserDans(userDansVal.current)
        } else {
            decrementUserDans(userDansVal.current)
        }
        userDansVal.current = userDans
    }, [userDans])

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
    }, [])

    const incrementCompletedPercentage = (percentage: number) => {
        if (percentage >= weekCompletedPercentage) return
        setTimeout(() => {
            setCompletedPercentage(Math.min(percentage + 1, 100))
            if (percentage < weekCompletedPercentage) incrementCompletedPercentage(percentage + 1)
        }, 15);
    }

    const decrementCompletedPercentage = (percentage: number) => {
        if (percentage <= weekCompletedPercentage) return
        setTimeout(() => {
            setCompletedPercentage(Math.max(percentage - 1, 0))
            if (percentage > weekCompletedPercentage) decrementCompletedPercentage(percentage - 1)
        }, 15);
    }

    const incrementUserDans = (value: number) => {
        if (value >= userDans) return
        setTimeout(() => {
            setUserDansState(value + 1)
            if (value < userDans) incrementUserDans(value + 1)
        }, 50);
    }

    const decrementUserDans = (value: number) => {
        if (value <= userDans) return
        setTimeout(() => {
            setUserDansState(value - 1)
            if (value > userDans) decrementUserDans(value - 1)
        }, 50);
    }




    return (
        <div className='ml-auto max-w-[500px] flex items-center gap-4'>
            <CompletedPercentage percentage={completedPercentage} />
            <div className='flex max-w-[200px] w-full overflow-hidden gap-2 whitespace-nowrap flex-col'>
                <div className='flex items-center w-full text-lightFont-500 gap-2 '>
                    <VilaIcon type={"user"} className='w-6 h-6' />
                    {user?.username}
                </div>
                <div className='flex w-full text-coinIcon gap-2'>
                    <VilaIcon type={"coin"} className='w-6 h-6' />
                    {userDansState}
                </div>
            </div>
            <VilaButtonIcon buttonStyle={'transparent'} icon={"logout"} onClick={onLogout} size={'s'} />
        </div >
    )
}