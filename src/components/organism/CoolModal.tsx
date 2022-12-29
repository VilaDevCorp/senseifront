import React, { ReactNode } from 'react';
import { ModalType } from '../../types/types';
import { useRecoilState } from 'recoil';
import { OtherModal } from './OtherModal';
import { useModal } from '../../hooks/useModal';


const getModalComponent = (modalType?: ModalType): JSX.Element => {
    switch (modalType) {
        case ModalType.CONFIRMATION:
            return <OtherModal />
        default:
            return <></>
    }
}


export function CoolModal() {

    const {modalProps, setModalProps} = useModal()

    return (
        modalProps.visible ?
            getModalComponent(modalProps.type)
            : <></>
    )
}