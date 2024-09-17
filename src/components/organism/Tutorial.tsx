import { useRef, useState } from 'react';
import { tutorialCompletedAtom, useAuth } from '../../hooks/useAuth';
import { VilaButton } from '../ui/VilaButton';
import { VilaButtonIcon } from '../ui/VilaButtonIcon';
import logo from '/logo.svg'
import activitiesTutorial from '/tutorial_activities.jpg'
import statsTutorial from '/tutorial_stats.jpg'
import plannerTutorial from '/tutorial_planner.jpg'
import userDataTutorial from '/tutorial_userdata.jpg'
import { VilaIcon } from '../ui/VilaIcon';
import { useApi } from '../../hooks/useApi';
import { useMisc } from '../../hooks/useMisc';
import { useRecoilValue } from 'recoil';

export function Tutorial() {

    const { user } = useAuth()
    const { triggerReloadUserInfo } = useMisc()
    const { completeTutorial } = useApi()
    const [step, setStep] = useState(0)
    const { setVisibleTutorial } = useMisc()
    const contentSection = useRef<HTMLDivElement>(null)
    const tutorialCompleted = useRecoilValue(tutorialCompletedAtom)


    const getSectionTitle = () => {
        switch (step) {
            case 0:
                return 'Welcome to Sensei'
            case 1:
                return 'Activities'
            case 2:
                return 'Dans'
            case 3:
                return 'Planner'
            case 4:
                return 'Templates'
            case 5:
                return 'Stats'
        }
    }

    const onCompleteTutorial = async () => {
        if (user && !tutorialCompleted) {
            await completeTutorial(user.id)
            triggerReloadUserInfo()
        }
        setVisibleTutorial(false)
    }

    const itemHighlighted = 'font-bold text-highlight text-right text-xl mr-2  inline-block'
    const tutorialText = 'text-lightFont-200 leading-10 text-xl'
    const getSection = () => {
        contentSection.current?.scrollTo(0, 0)
        switch (step) {
            case 0:
                return <>
                    <img className='w-[150px] m-auto mb-10' src={logo} />
                    <p className='text-lightFont-200 leading-10 text-xl'>{`Hi ${user?.username}! With Sensei you can organize and track your trainings week by week.`}</p>
                    <p className='text-lightFont-200 leading-10 text-xl'>{'In this tutorial, we teach you how to use the app in 5 easy steps. '}</p>
                </>
            case 1:
                return <>
                    <img className='w-full max-w-[500px] m-auto md:float-right sm:ml-4' loading='eager' src={activitiesTutorial} />
                    <p className={tutorialText}>{'Each type of training session would be an activity. These are formed by: '}</p>
                    <ul className='text-lightFont-200 leading-10 text-lg list-none list-inside pl-4'>
                        <li><span className={itemHighlighted}>{'Name: '}</span>{'Identifier for your activity.'}</li>
                        <li><span className={itemHighlighted}>{'Description: '}</span>{'For detailing the exercise.'}</li>
                        <li><span className={itemHighlighted}>{'Size: '}</span>{'The value you give to the activity depending on the effort it takes. You can customize this to your needs. For example, a brisk walk would be a size of 1 and a vigorous 4 hour marathon training could be a 5.'}</li>
                        <li><span className={itemHighlighted}>{'Icon: '}</span>{'A decorator to better identify your activities.   '}</li>
                    </ul>
                </>
            case 2:
                return <>
                    <VilaIcon type='coin' className='ml- text-6xl m-auto text-coinIcon' />
                    <p className={tutorialText}>{' Dans are the coins of Sensei. You will receive as many dans as the size of your completed activities (when you complete an activitiy of size 3, you will earn 3 dans).'}</p>
                    <p className={tutorialText}>{'They are only for quantitative purposes so far, but in the future could be created a rewards system.'}</p>
                    <div className='flex flex-col sm:flex-row items-center ' >
                        <p className={tutorialText}>{'You can check at the top right corner the number of dans you have achieved and the percentage of completed dans in the current week. '}</p>
                        <img className='max-w-[200px] ml-4 m-auto' loading='eager' src={userDataTutorial} />
                    </div>
                </>
            case 3:
                return <>
                    <img className='w-full max-w-[500px] m-auto md:float-right sm:ml-4' loading='eager' src={plannerTutorial} />
                    <p className={tutorialText}>{'You can schedule your weekly training with our planner. Clicking on the + button will show a modal which allows you to select the activities you want to include in the day.'}</p>
                    <p className={tutorialText}>{'To manage the activities already included, you can use the bottom left buttons:'}</p>
                    <ul className='text-lightFont-200 mt-4 leading-10 text-lg list-none list-inside pl-4'>
                        <li className='flex mb-4 gap-2'><VilaButtonIcon icon='check' />{' Complete activities.'}</li>
                        <li className='flex mb-4 gap-2'><VilaButtonIcon icon='close' />{' Undo comletion.'}</li>
                        <li className='flex mb-4 gap-2'><VilaButtonIcon icon='delete' />{' Delete activities.'}</li>
                    </ul>
                </>
            case 4:
                return <>
                    <p className={tutorialText}>{'Templates are a fast way to organize your training.'}</p>
                    <p className={tutorialText}>{'To create a new template, navigate to the "Templates" section and open the dropdown menu of the desired element in the table (by right-clicking). Then, select the "Planner" option.'}</p>
                    <p className={tutorialText}>{'Then you can configure the template using the planner that appears.'}</p>
                    <p className={tutorialText}>{'Once your template is finished, you can apply it in the "Planner" section. The activities of the template will be added to the selected week.'}</p>
                </>
            case 5:
                return <>
                    <img className='w-full max-w-[500px] m-auto md:float-right sm:ml-4' loading='eager' src={statsTutorial} />
                    <p className={tutorialText}>{'Here you can visualize statistics about your work, like the number of dans completed or the most used activities.'}</p>
                </>
        }
    }


    return (
        <div className="w-full top-0 left-0 h-full md:h-screen  backdrop-blur-sm flex z-40 max-h-screen justify-center items-center fixed backdrop-contrast-75 ">
            <div style={{ background: 'linear-gradient(120deg, rgba(6,15,20,1) 0%, rgba(19,43,55,1) 100%)' }}
                className={`relative flex h-full sm:h-3/4 max-h-[500px] flex-col px-3 py-3 bg-background-900  w-full `} onClick={(e) => e.stopPropagation()}>
                <h2 className='text-3xl text-lightFont-100 mt-4 m-auto flex justify-center gap-4 pb-4' ><span className=''>{`${step > 0 ? step + '/5' : ''}`}</span>{getSectionTitle()}</h2>
                <div ref={contentSection} className='px-2 mt-4 mb-4 py-2 h-[calc(100%-82px)] max-w-[1500px] m-auto overflow-y-auto   '>
                    {getSection()}
                </div>
                <div className='flex justify-between w-full shrink-0 h-[50px] m-auto items-center max-w-[500px]'>
                    {step > 0 ?
                        <VilaButtonIcon onClick={() => setStep((old) => old > 0 ? old - 1 : old)} className={`${step > 0 ? '' : ' invisible '}`} font='lightFont' icon='previous' />
                        :
                        <VilaButton buttonStyle='outlined' onClick={onCompleteTutorial} className='border-error' font='lightFont'>{"Skip tutorial"}</VilaButton>
                    }
                    {step < 5 ?
                        <VilaButtonIcon onClick={() => setStep((old) => old < 6 ? old + 1 : old)} className={`${step < 5 ? '' : ' invisible '}`} font='lightFont' icon='next' />
                        :
                        <VilaButton buttonStyle='outlined' onClick={onCompleteTutorial} className='border-error' font='lightFont'>{"Finish the tutorial"}</VilaButton>
                    }
                </div>
            </div>
        </div >
    )
}