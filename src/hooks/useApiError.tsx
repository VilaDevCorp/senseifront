import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ApiError } from '../types/types';
import StatusCode from 'status-code-enum';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useSnackbar } from './useSnackbar';
import { useAuth } from './useAuth';


export interface ApiErrorContext {
  error: Error | undefined,
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>,
}

const ApiErrorContext = createContext<ApiErrorContext>({} as any)

export const useApiError = ({ navigate }: { navigate: NavigateFunction }) => {
  const ctx = useContext(ApiErrorContext)
  const { error, setError } = ctx
  const snackbar = useSnackbar()
  const { logout } = useAuth()

  useEffect(() => {
    if (error) {
      if (error instanceof ApiError) {
        if (error.cause === StatusCode.ClientErrorForbidden) {
          logout()
          navigate("/login")
          snackbar.onOpen('Your session has expired', 'cancel', 'error')
          return
        }
        snackbar.onOpen('An internal error has occurred', 'cancel', 'error')
      } else {
        snackbar.onOpen('An internal error has occurred', 'cancel', 'error')
      }
      setError(undefined)
    }
  }, [ctx.error])


  if (ctx === null) {
    throw new Error('useApiError() can only be used on the descendants of ApiErrorProvider')
  } else {
    return ctx
  }
}

export const ApiErrorProvider = ({ children }: { children: ReactNode }) => {

  const [error, setError] = useState<Error | undefined>(undefined)

  const value: ApiErrorContext = {
    error, setError
  }

  return (
    <ApiErrorContext.Provider value={value}>
      {children}
    </ApiErrorContext.Provider>
  )
}
