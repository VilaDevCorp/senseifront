import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { useMisc } from '../hooks/useMisc';
import { VilaForm } from '../components/ui/VilaForm'
import { VilaTextInput } from '../components/ui/VilaTextInput';
import { VilaButton } from '../components/ui/VilaButton';
import logo from './../../public/logo.svg';
import { useValidator, notEmptyValidator } from '../hooks/useValidator';
import { ApiError } from '../types/types';
import StatusCode from 'status-code-enum';
import { VilaLayout } from '../components/ui/VilaLayout';
import { useSnackbar } from '../hooks/useSnackbar';
import { PublicFormLayout } from '../components/organism/PublicFormLayout';
import { VilaCheckbox } from '../components/ui/VilaCheckbox';


export function LoginScreen() {

    const auth = useAuth()
    const navigate = useNavigate()
    const theme = useTheme()
    const snackbar = useSnackbar()

    const [mail, setMail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    const { isLoading, setIsLoading, triggerReloadUserInfo } = useMisc()

    const [mailDirty, mailError, mailMessage, mailValidate, setMailDirty] = useValidator(mail, [notEmptyValidator]);
    const [passwordDirty, passwordError, passwordMessage, passwordValidate, setPasswordDirty] = useValidator(password, [notEmptyValidator]);


    const disabledButton = isLoading || mailError || passwordError

    const onLogin = async () => {
        const mailValid = mailValidate()
        const passwordValid = passwordValidate()

        if (mailValid && passwordValid) {
            setIsLoading(true)
            try {
                await auth.authenticate(mail, password, rememberMe)
                triggerReloadUserInfo()
                navigate('/')
            } catch (e) {
                setIsLoading(false)
                if (e instanceof ApiError) {
                    if (e.cause === StatusCode.ClientErrorUnauthorized && e.errCode === '002') {
                        navigate(`/validate/${mail}`)
                    }
                    if (e.cause === StatusCode.ClientErrorUnauthorized && e.errCode === '001' || e.cause === StatusCode.ClientErrorNotFound) {
                        snackbar.onOpen('Wrong credentials', 'cancel', 'error')
                    }
                } else {
                    snackbar.onOpen('An internal error has occurred', 'cancel', 'error')
                }
            }
            setIsLoading(false)
        }
    }

    const linkClasses = 'text-secondary-100  self-start cursor-pointer hover:text-secondary-400'

    return (
        <VilaLayout isPublic>
            <PublicFormLayout>
                <img src={logo} className='w-[120px] h-[120px]' alt='Logo login' />
                <VilaForm onSubmit={() => onLogin()} fields={[{ input: <VilaTextInput value={mail} setValue={setMail} errorMsg={mailDirty ? mailMessage : ''} setDirty={setMailDirty} />, label: 'Email' },
                { input: <VilaTextInput value={password} setValue={setPassword} type='password' errorMsg={passwordDirty ? passwordMessage : ''} setDirty={setPasswordDirty} />, label: 'Password' },
                { input: <VilaCheckbox label='Remember me' value={rememberMe} setValue={setRememberMe} />, label: '' }]} nColumns={1}></VilaForm>
                <a className={linkClasses} onClick={() => navigate("/recover-password")}>{'I have forgotten my password'}</a>
                <VilaButton className='!w-full !justify-center' disabled={disabledButton} onClick={() => onLogin()} icon={'login'} font='lightFont' >{'Login'}</VilaButton>
                <span className='text-lightFont-700 w-full justify-center gap-4 flex' >{"You don't have an account? "}<a className={linkClasses} onClick={() => navigate("/register")}>{'Sign up'}</a></span>
            </PublicFormLayout>
        </VilaLayout >
    )
}