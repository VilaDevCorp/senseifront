import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { useMisc } from '../../hooks/useMisc';
import { useTranslation } from 'react-i18next';
import { VilaButton } from '../ui/VilaButton';
import { VilaModal } from '../ui/VilaModal';
import { VilaForm } from '../ui/VilaForm';
import { VilaTextInput } from '../ui/VilaTextInput';
import { useValidator } from '../../hooks/useValidator';
import { notEmptyValidator } from '../../hooks/useValidator';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useApiError } from '../../hooks/useApiError';
import { useNavigate } from 'react-router-dom';


export function CreateTemplateModal({ templateId, onClose }: { templateId?: string, onClose: () => void }) {

    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const { createTemplate, getTemplate, updateTemplate } = useApi()
    const { user } = useAuth()
    const { setIsLoading, isLoading, triggerReloadTemplates } = useMisc()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { setError } = useApiError({ navigate })
    const [nameDirty, nameError, nameMessage, nameValidate, setNameDirty] = useValidator(name, [notEmptyValidator])
    const snackbar = useSnackbar()

    const disabledButton = isLoading || nameError

    useEffect(() => {
        onGetTemplate()
    }, [])


    const onGetTemplate = async () => {
        setIsLoading(() => true)
        try {
            if (templateId) {
                const template = await getTemplate(templateId)
                setId(template.id)
                setName(template.name)
            }
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }

    }

    const onConfirm = async () => {
        setIsLoading(() => true)
        const nameValid = nameValidate()
        try {
            if (id) {
                if (nameValid) {
                    await updateTemplate({ id, name })
                    triggerReloadTemplates()
                    snackbar.onOpen('Template updated!', 'check', 'success')
                    onClose()
                }
            } else {
                if (nameValid && user?.id) {
                    await createTemplate({ name, userId: user.id, tasks: [] })
                    triggerReloadTemplates()
                    snackbar.onOpen('Template created!', 'check', 'success')
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
        <VilaModal onClose={onClose} hasHeader title={`${templateId ? 'Edit template' : 'Create template'}`} size='m-fluid-h'
            buttons={[<VilaButton buttonStyle={'outlined'} onClick={() => onClose()} font='lightFont'>{'Cancel'}</VilaButton>,
            <VilaButton font='lightFont' buttonStyle={'filled'} onClick={() => onConfirm()} disabled={disabledButton}>{'Save'}</VilaButton>]}>
            <VilaForm onSubmit={onConfirm} nColumns={1} fields={[
                {
                    label: 'Name', input: <VilaTextInput value={name} setValue={setName} maxChars={120} errorMsg={nameDirty ? nameMessage : ''} setDirty={setNameDirty} />
                }]} />
        </VilaModal >
    )
}