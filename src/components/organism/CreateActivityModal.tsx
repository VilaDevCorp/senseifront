import { useEffect, useState } from 'react';
import { useApi } from '../../hooks//useApi';
import { useAuth } from '../../hooks//useAuth';
import { SizeSelector } from '../molecule/SizeSelector';
import { IconSelector } from '../molecule/IconSelector';
import { useMisc } from '../../hooks//useMisc';
import { useTranslation } from 'react-i18next';
import { VilaButton } from '../ui/VilaButton';
import { VilaModal } from '../ui/VilaModal';
import { VilaForm } from '../ui/VilaForm';
import { VilaTextInput } from '../ui/VilaTextInput';
import { ActivityType } from '../atom/ActivityIcon';
import { VilaTextArea } from '../ui/VilaTextArea';
import { useValidator } from '../../hooks/useValidator';
import { notEmptyValidator } from '../../hooks/useValidator';
import { useApiError } from '../../hooks/useApiError';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../hooks/useSnackbar';
import { ScreenWidthEnum, useScreen } from '../../hooks/useScreen';


export function CreateActivityModal({ activityId, onClose }: { activityId?: string, onClose: () => void }) {

    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [icon, setIcon] = useState<ActivityType | undefined>(undefined)
    const [size, setSize] = useState<number | undefined>(undefined)
    const { createActivity, getActivity, updateActivity } = useApi()
    const { user } = useAuth()
    const { setIsLoading, triggerReloadActivities, isLoading } = useMisc()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { setError } = useApiError({ navigate })
    const snackbar = useSnackbar()
    const { screenWidth } = useScreen()

    const [nameDirty, nameError, nameMessage, nameValidate, setNameDirty] = useValidator(name, [notEmptyValidator])
    const [sizeDirty, sizeError, sizeMessage, sizeValidate] = useValidator(size ? size.toString() : '', [notEmptyValidator])

    const disabledButton = isLoading || nameError || sizeError

    useEffect(() => {
        onGetActivity()
    }, [])


    const onGetActivity = async () => {
        setIsLoading(() => true)
        try {
            if (activityId) {
                const activity = await getActivity(activityId)
                setId(activity.id)
                setName(activity.name)
                setSize(activity.size)
                setDescription(activity.description)
                setIcon(activity.icon ? activity.icon : undefined)
            }
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }
    }

    const onConfirm = async () => {
        setIsLoading(() => true)
        const sizeValid = sizeValidate()
        const nameValid = nameValidate()
        try {
            if (id) {
                if (nameValid && sizeValid) {
                    await updateActivity({ id, name, size: size!, icon: icon, description })
                    triggerReloadActivities()
                    snackbar.onOpen('Activity updated!', 'check', 'success')
                    onClose()
                }
            } else {
                if (nameValid && sizeValid && user?.id) {
                    await createActivity({ name, size: size!, userId: user.id, icon: icon, description })
                    triggerReloadActivities()
                    snackbar.onOpen('Activity created!', 'check', 'success')
                    onClose()
                }
            }
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <VilaModal onClose={onClose} hasHeader title={`${activityId ? 'Edit activity' : 'Create activity'}`} size='m-squared'
            buttons={[<VilaButton buttonStyle={'outlined'} onClick={() => onClose()} font='lightFont'>{'Cancel'}</VilaButton>,
            <VilaButton font='lightFont' buttonStyle={'filled'} onClick={() => onConfirm()} disabled={disabledButton}>{'Save'}</VilaButton>]}>
            <VilaForm onSubmit={onConfirm} nColumns={screenWidth > ScreenWidthEnum.s ? 2 : 1} fields={[
                {
                    label: 'Name', input: <VilaTextInput value={name} setValue={setName} maxChars={120} errorMsg={nameDirty ? nameMessage : ''} setDirty={setNameDirty} />
                },
                {
                    label: 'Size', input: <SizeSelector setSize={setSize} size={size} errorMsg={sizeDirty ? sizeMessage : ''} />
                },
                {
                    label: 'Description', input: <VilaTextArea value={description} setValue={setDescription}  maxChars={255} />
                },
                {
                    label: 'Icon', input: <IconSelector setIcon={setIcon} icon={icon} />
                }]} />
        </VilaModal >
    )
}