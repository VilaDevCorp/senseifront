import React, { useState } from 'react';
import { useApi } from '../../hooks//useApi';
import { useMisc } from '../../hooks//useMisc';
import { VilaButtonIcon } from '../ui/VilaButtonIcon';
import { ConfirmationModal } from '../organism/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { useSnackbar } from '../../hooks/useSnackbar';

export function ActivityOptions({ selectedTasks, setSelectedTasks }: { selectedTasks: string[], setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>> }) {

    const { deleteTasks, completeTasks } = useApi()
    const { setIsLoading, triggerReloadTasks, triggerReloadUserInfo } = useMisc()
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState<boolean>(false)
    const navigate = useNavigate()
    const { setError } = useApiError({ navigate })
    const snackbar = useSnackbar()

    const isActivities: boolean = selectedTasks ? selectedTasks.length > 0 : false

    const onCompleteTasks = async () => {
        setIsLoading(() => true)
        try {
            await completeTasks({ taskIds: selectedTasks, isCompleted: true })
            setSelectedTasks([])
            triggerReloadTasks()
            triggerReloadUserInfo()
            snackbar.onOpen('Tasks completed!', 'check', 'success')
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }

    }

    const onUncompleteTasks = async () => {
        setIsLoading(() => true)
        try {
            await completeTasks({ taskIds: selectedTasks, isCompleted: false })
            setSelectedTasks([])
            triggerReloadTasks()
            triggerReloadUserInfo()
            snackbar.onOpen('Tasks uncompleted!', 'cancel', 'success')
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }
    }

    const onConfirmDeleteTasks = async () => {
        setIsLoading(() => true)
        try {
            await deleteTasks(selectedTasks)
            setSelectedTasks([])
            triggerReloadTasks()
            triggerReloadUserInfo()
            snackbar.onOpen('Tasks deleted!', 'delete', 'success')
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }
    }
    const onDeleteTasks = async () => {
        setConfirmDeleteModalVisible(true)
    }

    return (
        <div className={`flex justify-center items-center rounded-lg gap-4`}>
            <VilaButtonIcon disabled={!isActivities} size={'m'} icon={'confirm'} onClick={onCompleteTasks}></VilaButtonIcon>
            <VilaButtonIcon disabled={!isActivities} size={'m'} icon={'cancel'} onClick={onUncompleteTasks}></VilaButtonIcon>
            <VilaButtonIcon disabled={!isActivities} size={'m'} icon={'delete'} onClick={onDeleteTasks}></VilaButtonIcon>
            <>{confirmDeleteModalVisible && <ConfirmationModal onClick={() => onConfirmDeleteTasks()} onClose={() => setConfirmDeleteModalVisible(false)} label='Do you really want to delete these tasks?' />}</>
        </div>
    )
}