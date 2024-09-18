import React, { useEffect, useState } from 'react';
import { VilaButtonIcon } from '../ui/VilaButtonIcon';
import moment from 'moment';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { Template } from '../../types/entities';
import { SelectOption, VilaSelect } from '../ui/VilaSelect';
import { useMisc } from '../../hooks/useMisc';
import { conf } from '../../conf';
import { useNavigate } from 'react-router-dom';
import { useApiError } from '../../hooks/useApiError';
import { useSnackbar } from '../../hooks/useSnackbar';

export function TemplateSelector({ startDate }: { startDate: Date | undefined }) {

    const { user } = useAuth()
    const { getAllUserTemplates, applyTemplate } = useApi()
    const { setIsLoading, triggerReloadTasks, triggerReloadUserInfo } = useMisc()

    const [templates, setTemplates] = useState<SelectOption[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<string>('')
    const navigate = useNavigate()
    const { setError } = useApiError({ navigate })
    const snackbar = useSnackbar()


    useEffect(() => {
        onGetTemplates()
    }, [])

    const onGetTemplates = async () => {
        try {
            const templates = await getAllUserTemplates(user?.id!)
            const options: SelectOption[] = templates.content.map((template) => { return { label: template.name, value: template.id } })
            setTemplates(options)
        } catch (e) {
            setError(e as Error)
        }
    }

    const onApplyTemplate = async () => {
        setIsLoading(true)
        try {
            if (startDate && user) {
                await applyTemplate(selectedTemplate, { startDate: moment(startDate).format(conf.dateInputFormat), userId: user?.id })
                triggerReloadTasks()
                triggerReloadUserInfo()
                snackbar.onOpen('Template applied!', 'check', 'success')
            }
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className={`flex justify-center items-center rounded-lg gap-2`}>
            <div className='flex gap-2'>
            </div>
            <VilaSelect options={templates} value={selectedTemplate} setValue={setSelectedTemplate} emptyLabel='Select a template to apply' />
            <VilaButtonIcon disabled={!selectedTemplate} onClick={onApplyTemplate} size={'s'} icon={'play'}></VilaButtonIcon>
        </div>
    )
}