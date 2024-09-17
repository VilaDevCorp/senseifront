import { ApiError, Page } from '../../types/types';
import { useEffect, useRef, useState } from 'react';
import { ActivityArea } from './ActivityArea';
import { Activity } from '../../types/entities';
import { useApi } from '../../hooks//useApi';
import { useAuth } from '../../hooks//useAuth';
import { useTranslation } from 'react-i18next';
import { VilaModal } from '../ui/VilaModal';
import { VilaPagination } from '../ui/VilaPagination';
import { VilaButton } from '../ui/VilaButton';
import { VilaTextInput } from '../ui/VilaTextInput';
import { conf } from './../../conf'
import moment from 'moment';
import { useMisc } from '../../hooks/useMisc';
import { useApiError } from '../../hooks/useApiError';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../hooks/useSnackbar';
import StatusCode from 'status-code-enum';
import { PuffLoader } from 'react-spinners';
import { useDescriptionDialog } from '../../hooks/useDescriptionDialog';

export function SelectActivityModal({ date, onClose }: { date?: Date, onClose: () => void }) {

    const [searchText, setSearchText] = useState<string>('')
    const [page, setPage] = useState<number>(0)
    const { t } = useTranslation()
    const { setIsLoading, triggerReloadTasks, triggerReloadUserInfo } = useMisc()
    const firstRender = useRef<boolean>(true)

    const [activityPage, setActivityPage] = useState<Page<Activity> | undefined>(undefined)
    const [selectedActivities, setSelectedActivities] = useState<string[]>([])
    const { getActivities, createTask } = useApi()
    const { user } = useAuth()
    const navigate = useNavigate()
    const { setError } = useApiError({ navigate })
    const snackbar = useSnackbar()
    const [isLoadingActivities, setIsLoadingActivities] = useState<boolean>(false)

    const handleEnterPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            onConfirm()
        }
    }

    useEffect(() => {
    }, [])

    useEffect(() => {
        if (!firstRender.current) {
            const timer = setTimeout(() => onReloadActivities(), 500)
            return (() => clearTimeout(timer))
        }
        firstRender.current = false
    }, [searchText])


    useEffect(() => {
        window.addEventListener("keydown", handleEnterPress);
        return () => {
            window.removeEventListener("keydown", handleEnterPress);
        };
    }, [selectedActivities]);



    const onGetActivities = async () => {
        setIsLoadingActivities(() => true)
        try {
            if (user === undefined) {
                return
            }
            const activityPage = await getActivities(page, searchText, user.id)
            setActivityPage(activityPage)
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoadingActivities(false)
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        }
        onGetActivities()
    }, [page])

    useEffect(() => {
        if (!firstRender) {
            const timer = setTimeout(() => onReloadActivities(), 500)
            return (() => clearTimeout(timer))
        }
    }, [searchText])

    const onReloadActivities = () => {
        if (page === 0) {
            onGetActivities()
        } else {
            setPage(0)
        }
    }

    const onConfirm = async () => {
        setIsLoading(() => true)
        try {
            await Promise.all(selectedActivities.map(async (activity) => {
                if (date && user?.id) {
                    await createTask({ activityId: activity, dueDate: moment(date).format(conf.dateInputFormat), userId: user.id })
                }
            }))
            triggerReloadTasks()
            snackbar.onOpen('Tasks added!', 'check', 'success')
            triggerReloadUserInfo()
            onClose()
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <VilaModal onClose={onClose} hasHeader title='Select activity' size='m-longer'
            buttons={[<VilaButton buttonStyle={'outlined'} onClick={() => onClose()} font='lightFont'>{'Cancel'}</VilaButton>,
            <VilaButton disabled={selectedActivities.length < 1} font='lightFont' buttonStyle={'filled'} onClick={() => onConfirm()}>{'Save'}</VilaButton>]}>
            <div className='flex flex-col w-full h-full overflow-hidden gap-4'>
                <VilaTextInput icon='search' setValue={setSearchText} value={searchText} />
                <div className='flex flex-col w-full h-full md:h-[300px] relative overflow-y-auto overflow-x-hidden items-center gap-2'>
                    {isLoadingActivities ?
                        <span className='w-full h-full grow flex justify-center items-center'>
                            <PuffLoader color='#124969' loading size={100} />
                        </span>
                        :
                        <ActivityArea activities={activityPage?.content ? activityPage.content : []} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                    }
                </div>
                <VilaPagination page={page} setPage={setPage} maxVisiblePages={5}
                    totalPages={activityPage?.totalPages ? activityPage.totalPages : 0} />
            </div>
        </VilaModal >
    )
}