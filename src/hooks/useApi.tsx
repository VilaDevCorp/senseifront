import React, { createContext, ReactNode, useContext } from 'react';
import { User } from '../types/entities';
import { conf } from './../conf'

export interface ApiContext {
    login: (user: string, password: string) => void
    logout: () => void
    fakeDelay: (delay: number) => void
    getUserInfo: () => Promise<User>
}

const ApiContext = createContext<ApiContext>({} as any)

export const useApi = () => {
    const ctx = useContext(ApiContext)
    if (ctx === null) {
        throw new Error('useApi() can only be used on the descendants of ApiProvider')
    } else {
        return ctx
    }
}



export const ApiProvider = ({ children }: { children: ReactNode }) => {

    function fakeDelay(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const login = async (user: string, password: string) => {
        const url = `${conf.mainApiUrl}public/user?user=${user}&password=${password}`
        // const options: RequestInit = {
        //     credentials: 'include',
        //     method: 'POST',
        //     headers: new Headers({
        //         'content-type': 'application/json',
        //     })
        // }
        // let result = []
        // try {
        //     const res = await fetch(url, options)
        //     if (!res.ok) {
        //         throw new Error(JSON.stringify(res))
        //     }
        //     const resObject = await res.json()
        //     result = resObject
        // } catch (e) {
        //     throw Error('Error al realizar el login')
        // }
    }

    const logout = async () => {
        const url = `${conf.mainApiUrl}public/user/logout`
        // const options: RequestInit = {
        //     credentials: 'include',
        //     method: 'POST',
        //     headers: new Headers({
        //         'content-type': 'application/json',
        //     })
        // }
        // try {
        //     const res = await fetch(url, options)
        //     if (!res.ok) {
        //         throw new Error(JSON.stringify(res))
        //     }
        // } catch (e) {
        //     throw Error('Error al cerrar sesión')
        // }
    }

    const getUserInfo = async (): Promise<User> => {
        const url = `${conf.mainApiUrl}public/myuser`
        // const options: RequestInit = {
        //     credentials: 'include',
        //     method: 'GET',
        //     headers: new Headers({
        //         'content-type': 'application/json',
        //     })
        // }
        // let result = []
        // try {
        //     const res = await fetch(url, options)
        //     if (!res.ok) {
        //         throw new Error(JSON.stringify(res))
        //     }
        //     const resObject = await res.json()
        //     result = resObject
        // } catch (e) {
        //     throw Error('Error al obtener la info del usuario')
        // }
        // return result
        return { id: '123', name: 'david@notacool.com', pass: '1234' }
    }


    const value: ApiContext = {
        login, 
        logout, 
        getUserInfo,
        fakeDelay
    }

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    )
}
