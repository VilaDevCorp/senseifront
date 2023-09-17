import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { PuffLoader, PulseLoader } from 'react-spinners';
import { useMisc } from '../../hooks//useMisc';
import { VilaTextInput } from './VilaTextInput';
import { ContextMenuPosition, ContextOption, VilaContextMenu } from './VilaContextMenu';
import { VilaTooltip } from './VilaTooltip';
import { ScreenWidthEnum, useScreen } from '../../hooks/useScreen';

export interface RealEntity {
    id: string;
    [key: string]: any;
}

export interface TableCell {
    displayFields: (string | JSX.Element)[]
    realEntity: RealEntity
}

type Props = {
    headers: string[]
    data: TableCell[]
    contextOptions?: ContextOption[]
    isLoading?: boolean
    searchKey?: string
    setSearchKey?: React.Dispatch<SetStateAction<string>>
    buttons?: JSX.Element[]
}

export function VilaTable(props: Props) {


    const [contextMenuProps, setContextMenuProps] = useState<ContextMenuPosition>({ top: 0, left: 0, visible: false })
    const [selectedElements, setSelectedElements] = useState<Map<number, unknown>>(new Map<number, unknown>())

    const { clearContext } = useMisc()

    const [loadingContainerHeight, setLoadingContainerHeight] = useState<number>()
    const loadingContainer = useRef<HTMLDivElement>(null)

    const tableBodyRef = useRef<HTMLTableSectionElement | null>(null);
    const tableHeadRef = useRef<HTMLTableSectionElement | null>(null);

    const { screenWidth } = useScreen()


    useEffect(() => {
        setLoadingContainerHeight(loadingContainer.current?.clientHeight)
    }, [])


    useEffect(() => {
        setContextMenuProps({ visible: false, top: 0, left: 0 })
        setSelectedElements(new Map<number, unknown>())
    }, [clearContext])


    const onSelect = (index: number) => {
        setContextMenuProps({ visible: false, top: 0, left: 0 })
        if (selectedElements.has(index)) {
            setSelectedElements((oldValue) => {
                oldValue.delete(index)
                return oldValue
            })
        } else {
            setSelectedElements((oldValue) => {
                oldValue.set(index, props.data[index].realEntity)
                return oldValue
            })
        }
    }

    const onOpenContextMenu = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, index: number) => {
        if (props.contextOptions) {
            e.preventDefault()
            if (!selectedElements.has(index)) {
                setSelectedElements(new Map<number, unknown>([[index, props.data[index].realEntity]]))
            }
            let topPosition = 0
            let leftPosition = 0
            let invertedX = false
            let invertedY = false
            if (tableBodyRef.current && tableHeadRef.current) {
                const tableContainerWithoutHeader = loadingContainer.current ? loadingContainer.current.clientHeight - tableHeadRef.current.clientHeight : 0
                const topPositionRelativeToContainer = e.clientY - tableBodyRef.current.getBoundingClientRect().top
                topPosition = topPositionRelativeToContainer + tableHeadRef.current.clientHeight
                leftPosition = e.clientX - tableBodyRef.current.getBoundingClientRect().left
                invertedX = leftPosition > tableBodyRef.current.getBoundingClientRect().width / 2
                invertedY = topPositionRelativeToContainer - (loadingContainer.current ? loadingContainer.current.scrollTop : 0) > tableContainerWithoutHeader / 2
            }
            setContextMenuProps({
                top: topPosition, left: leftPosition, visible: true, nOptions: props.contextOptions.length,
                invertedX, invertedY
            })
        }
    }

    return (
        <div className='w-full flex flex-col h-full'>
            <div className='flex gap-4 flex-col md:flex-row items-center'>
                {props.searchKey !== undefined && props.setSearchKey ?
                    <div className='min-w-[50%] flex items-center w-full md:w-auto'>
                        <VilaTextInput icon={'search'} value={props.searchKey} setValue={props.setSearchKey} noError />
                    </div>
                    :
                    undefined
                }
                <div className='ml-auto flex gap-3 items-center'>
                    <VilaTooltip message={screenWidth > ScreenWidthEnum.m ? 'You can select items by clicking on them and open the menu by right clicking'
                        : 'You can select items by clicking on them and open the menu by holding down'} />

                    {props.buttons}
                </div>
            </div>
            <div className='w-full h-full overflow-auto mt-4 relative' ref={loadingContainer} onScroll={() => setContextMenuProps({ visible: false, top: 0, left: 0 })}>
                {props.isLoading &&
                    <div style={{ height: `${loadingContainerHeight}px`, marginTop: `-${loadingContainerHeight}px` }} className={`w-full sticky justify-center items-center flex top-0 z-10 backdrop-blur-sm`}>
                        <div className='w-full h-full flex justify-center items-center'>
                            <div className='w-full flex sticky justify-center align-middle'>
                                <PuffLoader size={100} color={'#77B78E'} />
                            </div>
                        </div>
                    </div>
                }
                <table className='w-full leading-10  rounded-lg'>
                    <thead ref={tableHeadRef} className='w-full text-lightFont-500 text-left sticky backdrop-brightness-50 backdrop-blur-sm rounded-t-lg top-0'>
                        <tr>
                            {props.headers.map((header) =>
                                <th key={`key_${header}_header`} className={`px-4 py-3 font-["Montserrat"]`}>
                                    {header.toUpperCase()}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody ref={tableBodyRef} className='text-lightFont-500'>
                        {props.data && props.data.length > 0 ?
                            props.data && props.data.map((element, index) => {
                                return <tr key={`table_element_${element.realEntity.id}`} className={`leading-[40px] cursor-default border-b border-background-400  
                            ${selectedElements.has(index) ? ' bg-background-300 text-lightFont-500' : ' hover:bg-background-400 hover:text-lightFont-500 '}`}
                                    onContextMenu={(e) => { onOpenContextMenu(e, index) }}
                                    onClick={() => onSelect(index)}>
                                    {element.displayFields.map((field, index) =>
                                        <td key={`table_element_${element.realEntity.id}_${index}`} className={`px-4 py-3`} >{field ? field : ''}</td>
                                    )}
                                </tr>
                            })
                            :
                            <tr>
                                <td className='w-full absolute flex justify-center mt-10 items-center text-lightFont-300 text-xl'>{'No elements found'}</td>
                            </tr>
                        }

                    </tbody>
                </table>
                {props.contextOptions ?
                    <VilaContextMenu top={contextMenuProps.top} left={contextMenuProps.left} visible={contextMenuProps.visible}
                        invertedX={contextMenuProps.invertedX} invertedY={contextMenuProps.invertedY} options={props.contextOptions} selectedElements={Array.from(selectedElements.values())}
                        tableBodyRef={tableBodyRef}></VilaContextMenu>
                    : undefined
                }
            </div>
        </div>
    )
}