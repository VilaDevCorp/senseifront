import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { VilaForm } from '../components/ui/VilaForm'
import { VilaTextInput } from '../components/ui/VilaTextInput';
import { VilaButton } from '../components/ui/VilaButton';
import logo from './../../public/logo.svg';
import { emailValidator, minLength8Validator, notEmptyValidator, upperLowerCaseValidator, useValidator } from '../hooks/useValidator';
import { VilaLayout } from '../components/ui/VilaLayout';
import { ApiError } from '../types/types';
import StatusCode from 'status-code-enum';
import { useSnackbar } from '../hooks/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { useMisc } from '../hooks/useMisc';
import { ScreenWidthEnum, useScreen } from '../hooks/useScreen';
import { PublicFormLayout } from '../components/organism/PublicFormLayout';


export function RegisterScreen() {

    const { register } = useApi()
    const snackbar = useSnackbar()
    const navigate = useNavigate()
    const { isLoading, setIsLoading } = useMisc()

    const { screenWidth } = useScreen()

    const [username, setUsername] = useState<string>('')
    const [mail, setMail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')

    const [usernameDirty, usernameError, usernameMessage, usernameValidate, setUsernameDirty] = useValidator(username, [notEmptyValidator])
    const [mailDirty, mailError, mailMessage, mailValidate, setMailDirty] = useValidator(mail, [notEmptyValidator, emailValidator]);
    const [passwordDirty, passwordError, passwordMessage, passwordValidate, setPasswordDirty] = useValidator(password, [notEmptyValidator, minLength8Validator, upperLowerCaseValidator]);
    const [passwordMatchError, setPasswordMatchError] = useState<string>('')

    const disabledButton = isLoading || mailError || passwordError || passwordMatchError !== '' || usernameError

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


    const onRegister = async () => {
        const usernameValid = usernameValidate()
        const mailValid = mailValidate()
        const passwordValid = passwordValidate()
        const passwordMatch = passwordMatchValidate()
        if (usernameValid && mailValid && passwordValid && passwordMatch) {
            setIsLoading(true)
            try {
                await register({ username, mail, password })
                snackbar.onOpen('User succesfully registered', 'check', 'success')
                navigate("/login")
            } catch (e) {
                if (e instanceof ApiError) {
                    if (e.cause === StatusCode.ClientErrorConflict) {
                        if (e.errCode === 'user') {
                            snackbar.onOpen('The username is already in use', 'cancel', 'error')
                        }
                        if (e.errCode === 'mail') {
                            snackbar.onOpen('The email is already in use', 'cancel', 'error')
                        }
                    } else {
                        snackbar.onOpen('An internal error has occurred', 'cancel', 'error')
                    }
                } else {
                    snackbar.onOpen('An internal error has occurred', 'cancel', 'error')
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <VilaLayout isPublic>
            <PublicFormLayout>
                <img src={logo} className='w-[120px] h-[120px]' alt='Logo login' />
                <VilaForm onSubmit={() => onRegister()} fields={
                    [{ input: <VilaTextInput value={username} setValue={setUsername} errorMsg={usernameDirty ? usernameMessage : ''} setDirty={setUsernameDirty}  />, label: 'Username' },
                    { input: <VilaTextInput value={mail} setValue={setMail} errorMsg={mailDirty ? mailMessage : ''} setDirty={setMailDirty} />, label: 'Email' },
                    { input: <VilaTextInput value={password} setValue={setPassword} type='password' errorMsg={passwordDirty ? passwordMessage : ''} setDirty={setPasswordDirty} />, label: 'Password' },
                    { input: <VilaTextInput value={repeatPassword} setValue={setRepeatPassword} type='password' errorMsg={passwordMatchError} />, label: 'Repeat password' }
                    ]} nColumns={1}></VilaForm>
                <VilaButton disabled={disabledButton} onClick={onRegister} font='lightFont' >{'Sign up'}</VilaButton>
            </PublicFormLayout>
        </VilaLayout>
    )
}