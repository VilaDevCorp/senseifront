import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useApi } from '../hooks/useApi';
import { useMisc } from '../hooks/useMisc';
import { VilaForm } from '../components/ui/VilaForm'
import { VilaTextInput } from '../components/ui/VilaTextInput';
import { VilaButton } from '../components/ui/VilaButton';
import logo from './../../public/logo.svg';
import { useValidator, notEmptyValidator, minLength8Validator, upperLowerCaseValidator } from '../hooks/useValidator';
import { useSnackbar } from '../hooks/useSnackbar';
import { ApiError } from '../types/types';
import StatusCode from 'status-code-enum';
import { VilaLayout } from '../components/ui/VilaLayout';
import { PublicFormLayout } from '../components/organism/PublicFormLayout';


export function ForgottenPasswordScreen() {

    const navigate = useNavigate()
    const theme = useTheme()
    const { useVerificationCode, sendVerificationCode } = useApi()
    const [mail, setMail] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const [step, setStep] = useState<number>(1)
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')
    const { isLoading, setIsLoading } = useMisc()
    const snackbar = useSnackbar()
    const [mailDirty, mailError, mailMessage, mailValidate, setMailDirty] = useValidator(mail, [notEmptyValidator]);
    const [codeDirty, codeError, codeMessage, codeValidate, setCodeDirty] = useValidator(code, [notEmptyValidator]);
    const [passwordDirty, passwordError, passwordMessage, passwordValidate, setPasswordDirty] = useValidator(password, [notEmptyValidator, minLength8Validator, upperLowerCaseValidator]);
    const [passwordMatchError, setPasswordMatchError] = useState<string>('')

    const disabledButton = step === 1 ? isLoading || mailError : isLoading || mailError || passwordError || passwordMatchError !== '' || codeError


    const passwordMatchValidate = () => {
        if (password === repeatPassword) {
            setPasswordMatchError('')
            return true
        } else {
            setPasswordMatchError('The passwords do not match')
            return false
        }
    }

    useEffect(() => {
        passwordMatchValidate()
    }, [password, repeatPassword])



    const onValidate = async () => {
        const mailValid = mailValidate()
        const codeValid = codeValidate()
        const passwordValid = passwordValidate()
        if (mailValid && codeValid && passwordValid) {
            setIsLoading(true)
            try {
                await useVerificationCode({ code, mail: mail, type: 'recover_password', newPass: password })
                snackbar.onOpen('Your password has been changed! Now you can login', 'check', 'success')
                navigate('/login')
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
    const onSendCode = async () => {
        setIsLoading(true)
        try {
            const mailValid = mailValidate()
            if (mailValid) {
                await sendVerificationCode({ mail: mail, type: 'recover_password' })
                snackbar.onOpen('The code was succesfully sent!', 'check', 'success')
                setStep(2)
            }
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
                        <p className='text-lightFont-600 w-fit mb-2' >{"Write your email and we will send you a code for resetting your password in the next screen."}</p>
                        <VilaForm onSubmit={() => onSendCode()} fields={[{ input: < VilaTextInput value={mail} setValue={setMail} errorMsg={mailDirty ? mailMessage : ''} setDirty={setMailDirty} />, label: 'Email' }]} nColumns={1} />
                        <VilaButton disabled={disabledButton} className='!w-full !justify-center mt-6 mb-4' onClick={() => onSendCode()} font='lightFont' >{'Send code'}</VilaButton>
                    </>
                    :
                    <>
                        <img src={logo} className='w-[120px] h-[120px]' alt='Logo login' />
                        <p className='text-lightFont-600 w-fit mb-2' >{"Write your code and the new password for your account."}</p>
                        <VilaForm onSubmit={() => onValidate()} fields={[{ input: <VilaTextInput value={mail} setValue={() => false} disabled />, label: 'Email' },
                        { input: <VilaTextInput value={code} setValue={setCode} errorMsg={codeDirty ? codeMessage : ''} setDirty={setCodeDirty} />, label: 'Code' },
                        { input: <VilaTextInput value={password} setValue={setPassword} type={'password'} errorMsg={passwordDirty ? passwordMessage : ''} setDirty={setPasswordDirty} />, label: 'Password' },
                        { input: <VilaTextInput value={repeatPassword} setValue={setRepeatPassword} type={'password'} errorMsg={passwordMatchError} />, label: 'Repeat password' },
                        ]} nColumns={1}></VilaForm>
                        <VilaButton disabled={disabledButton} className='!w-full !justify-center mt-6 mb-4' onClick={() => onValidate()} font='lightFont' >{'Change password'}</VilaButton>
                        <span className='text-lightFont-700 w-full justify-center gap-4 flex' >{"You don't see the code in your email? "}<a className={linkClasses} onClick={() => setStep(1)}>{'Go back'}</a></span>
                    </>
                }
            </PublicFormLayout >
        </VilaLayout>
    )
}