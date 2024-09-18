import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useMisc } from '../../hooks/useMisc';
import { VilaButtonIcon } from '../ui/VilaButtonIcon';
import { ConfirmationModal } from '../organism/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { useSnackbar } from '../../hooks/useSnackbar';

export function TemplateActivityOptions({ selectedTasks, setSelectedTasks }: { selectedTasks: string[], setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>> }) {

    const { deleteTemplateTasks } = useApi()
    const { setIsLoading, triggerReloadTasks } = useMisc()
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState<boolean>(false)
    const navigate = useNavigate()
    const { setError } = useApiError({ navigate })
    const snackbar = useSnackbar()

    const isActivities: boolean = selectedTasks ? selectedTasks.length > 0 : false

    const onConfirmDeleteTasks = async () => {
        setIsLoading(() => true)
        try {
            await deleteTemplateTasks(selectedTasks)
            setSelectedTasks([])
            triggerReloadTasks()
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
        <div className={`flex justify-start items-center rounded-lg gap-2`}>
            <VilaButtonIcon disabled={!isActivities} size={'m'} icon={'delete'} onClick={onDeleteTasks}></VilaButtonIcon>
            <>{confirmDeleteModalVisible && <ConfirmationModal onClick={() => onConfirmDeleteTasks()} onClose={() => setConfirmDeleteModalVisible(false)} label='Do you really want to delete these tasks?' />}</>
        </div>
    )
}