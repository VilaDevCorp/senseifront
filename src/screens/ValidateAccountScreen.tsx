import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useApi } from '../hooks/useApi';
import { useMisc } from '../hooks/useMisc';
import { VilaForm } from '../components/ui/VilaForm'
import { VilaTextInput } from '../components/ui/VilaTextInput';
import { VilaButton } from '../components/ui/VilaButton';
import logo from './../../public/logo.svg';
import { useValidator, notEmptyValidator } from '../hooks/useValidator';
import { useSnackbar } from '../hooks/useSnackbar';
import { ApiError } from '../types/types';
import StatusCode from 'status-code-enum';
import { VilaLayout } from '../components/ui/VilaLayout';
import { PublicFormLayout } from '../components/organism/PublicFormLayout';
import { VilaIcon } from '../components/ui/VilaIcon';


export function ValidateAccountScreen() {

    const navigate = useNavigate()
    const theme = useTheme()
    const { useVerificationCode, sendVerificationCode } = useApi()
    const [code, setCode] = useState<string>('')
    const [step, setStep] = useState<number>(1)
    const { userMail } = useParams();

    const { isLoading, setIsLoading } = useMisc()
    const snackbar = useSnackbar()
    const [codeDirty, codeError, codeMessage, codeValidate, setCodeDirty] = useValidator(code, [notEmptyValidator]);

    const disabledButton = isLoading || codeError

    const onValidate = async () => {
        const codeValid = codeValidate()
        if (codeValid) {
            setIsLoading(true)
            try {
                await useVerificationCode({ code, mail: userMail!, type: 'validate_account' })
                setStep(2)
                setTimeout(() => {
                    navigate('/login')
                }, 3500);
            } catch (e) {
                if (e instanceof ApiError) {
                    if (e.cause === StatusCode.ClientErrorNotFound || e.cause === StatusCode.ClientErrorUnauthorized) {
                        snackbar.onOpen('The code is not correct', 'cancel', 'error')
                    }
                    if (e.cause === StatusCode.ClientErrorGone) {
                        snackbar.onOpen('The code has expired', 'cancel', 'error')
                    }
                } else {
                    snackbar.onOpen('An internal error has occurred', 'cancel', 'error')
                }

                setIsLoading(false)
            }
            setIsLoading(false)
        }
    }
    const onResendCode = async () => {
        setIsLoading(true)
        try {
            await sendVerificationCode({ mail: userMail!, type: 'validate_account' })
            snackbar.onOpen('The code was succesfully sent!', 'check', 'success')
        } catch (e) {
            snackbar.onOpen('There was an error sending the new code. Try again', 'cancel', 'error')
            setIsLoading(false)
        }
        setIsLoading(false)
    }

    const linkClasses = 'text-secondary-100  self-start cursor-pointer hover:text-secondary-400'

    return (
        <VilaLayout isPublic>
            <PublicFormLayout>
                {step === 1 ?
                    <>
                        <img src={logo} className='w-[120px] h-[120px]' alt='Logo login' />
                        <p className='text-lightFont-600 w-fit mb-2' >{"Your email hasn't been validated yet. Write your email and the code we sent you for activating your account."}</p>
                        <VilaForm onSubmit={() => onValidate()} fields={[{ input: <VilaTextInput value={userMail!} setValue={() => false} disabled />, label: 'Email' },
                        { input: <VilaTextInput value={code} setValue={setCode} errorMsg={codeDirty ? codeMessage : ''} setDirty={setCodeDirty} />, label: 'Code' }]} nColumns={1}></VilaForm>
                        <VilaButton disabled={disabledButton} className='!w-full !justify-center mt-6 mb-4' onClick={() => onValidate()} font='lightFont' >{'Validate'}</VilaButton>
                        <span className='text-lightFont-700 w-full justify-center gap-4 flex' >{"You don't see the code in your email? "}<a className={linkClasses} onClick={() => onResendCode()}>{'Send a new code'}</a></span>
                    </>
                    :
                    <>
                        <VilaIcon type='check' className='text-6xl text-success' />
                        <p className='text-lightFont-600 w-fit mb-2' >{"Email validated! Now you can login."}</p>
                    </>
                }
            </PublicFormLayout>
        </VilaLayout>
    )
}