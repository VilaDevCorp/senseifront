import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import loginImg from './../../public/loginImg.png';
import { useMisc } from '../hooks/useMisc';
import { VilaForm } from '../components/ui/VilaForm'
import { VilaTextInput } from '../components/ui/VilaTextInput';
import { VilaButton } from '../components/ui/VilaButton';
import logo from './../../public/logo.svg';
import { useValidator, notEmptyValidator, emailValidator, minLength8Validator, upperLowerCaseValidator } from '../hooks/useValidator';
import { useSnackbar } from '../hooks/useSnackbar';
import { ApiError } from '../types/types';
import StatusCode from 'status-code-enum';
import { VilaLayout } from '../components/ui/VilaLayout';


export function ForgottenPasswordScreen() {

    const navigate = useNavigate()
    const theme = useTheme()
    const { useVerificationCode, sendVerificationCode } = useApi()
    const [mail, setMail] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const [step, setStep] = useState<number>(1)
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const snackbar = useSnackbar()
    const [mailDirty, mailError, mailMessage, mailValidate] = useValidator(mail, [notEmptyValidator]);
    const [codeDirty, codeError, codeMessage, codeValidate] = useValidator(code, [notEmptyValidator]);
    const [passwordDirty, passwordError, passwordMessage, passwordValidate] = useValidator(password, [notEmptyValidator, minLength8Validator, upperLowerCaseValidator]);
    const [passwordMatchError, setPasswordMatchError] = useState<string>('')


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
            <div className={`flex absolute top-0 z-50 w-full h-full justify-center items-center`}>
                {step === 1 ?
                    <div className={`flex w-[500px] h-full  items-center flex-col `}>
                        <img src={logo} className='w-[150px] h-[150px]' alt='Logo login' />
                        <p className='text-lightFont-600 w-fit mb-2' >{"Write your email and we will send you a code for resetting your password in the next screen."}</p>
                        <VilaForm fields={[{ input: < VilaTextInput value={mail} setValue={setMail} errorMsg={mailDirty ? mailMessage : ''} />, label: 'Email' }]} nColumns={1} />
                        <VilaButton className='!w-full !justify-center mt-6 mb-4' onClick={() => onSendCode()} font='lightFont' >{'Send code'}</VilaButton>
                    </div>
                    :
                    <div className={`flex w-[500px] h-full  items-center flex-col `}>
                        <img src={logo} className='w-[150px] h-[150px]' alt='Logo login' />
                        <p className='text-lightFont-600 w-fit mb-2' >{"Write your code and the new password for your account."}</p>
                        <VilaForm fields={[{ input: <VilaTextInput value={mail} setValue={() => false} disabled />, label: 'Email' },
                        { input: <VilaTextInput value={code} setValue={setCode} errorMsg={codeDirty ? codeMessage : ''} />, label: 'Code' },
                        { input: <VilaTextInput value={password} setValue={setPassword} type={'password'} errorMsg={passwordDirty ? passwordMessage : ''} />, label: 'Password' },
                        { input: <VilaTextInput value={repeatPassword} setValue={setRepeatPassword}  type={'password'} errorMsg={passwordMatchError} />, label: 'Repeat password' },
                        ]} nColumns={1}></VilaForm>
                        <VilaButton className='!w-full !justify-center mt-6 mb-4' onClick={() => onValidate()} font='lightFont' >{'Change password'}</VilaButton>
                        <span className='text-lightFont-700 w-full justify-center gap-4 flex' >{"You don't see the code in your email? "}<a className={linkClasses} onClick={() => setStep(1)}>{'Go back'}</a></span>
                    </div>
                }
            </div >
        </VilaLayout>
    )
}