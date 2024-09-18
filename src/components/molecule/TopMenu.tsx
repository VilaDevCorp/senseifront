import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuOption } from '../ui/VilaSidebar';


export function TopMenu({ options }: { options?: MenuOption[] }) {

    const navigate = useNavigate()
    const {pathname} = useLocation()

    return (
        <nav className='w-1/2 py-2 px-8 h-10 flex gap-8 items-center font-["Montserrat"]'>
            {options?.map((option) => (
                <a key={option.label} className={`text-lightFont-700 text-xl hover:text-primary-100 cursor-pointer transition-all ${option.route === pathname ? '!text-lightFont-100 font-semibold' : ''}`} href='#' onClick={() => navigate(option.route)}>
                    {option.label}
                </a>
            ))}
        </nav>
    )
}