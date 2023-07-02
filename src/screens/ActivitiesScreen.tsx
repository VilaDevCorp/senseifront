import { useEffect, useRef, useState } from 'react';
import { VilaLayout } from '../components/ui/VilaLayout';
import { useApi } from '../hooks/useApi';
import { useMisc } from '../hooks/useMisc';
import { TableCell, VilaTable } from '../components/ui/VilaTable';
import { VilaPagination } from '../components/ui/VilaPagination';
import { ContextOption } from '../components/ui/VilaContextMenu';
import { VilaButton } from '../components/ui/VilaButton';
import { CreateActivityModal } from '../components/organism/CreateActivityModal';
import { Activity } from '../types/entities';
import { ConfirmationModal } from '../components/organism/ConfirmationModal';
import { ApiError } from '../types/types';
import StatusCode from 'status-code-enum';
import { useSnackbar } from '../hooks/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ActivitiesScreen() {

    const headers = ['name', 'size']


    const { getActivities, deleteActivities } = useApi();
    const snackbar = useSnackbar()
    const {logout} = useAuth()

    const firstRender = useRef(true)
    const [page, setPage] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableCell[]>([])
    const { reloadActivitiesFlag, triggerReloadActivities } = useMisc()
    const [searchKey, setSearchKey] = useState<string>('')
    const [createActivityModalVisible, setCreateActivityModalVisible] = useState<boolean>(false)
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState<boolean>(false)
    const [activityForEdit, setActivityForEdit] = useState<string | undefined>(undefined)
    const [activitiesForDelete, setActivitiesForDelete] = useState<string[]>([])


    useEffect(() => {
        onGetActivities()
    }, [page, reloadActivitiesFlag])

    useEffect(() => {
        if (!firstRender.current) {
            const timer = setTimeout(() => onReloadActivities(), 500)
            return (() => clearTimeout(timer))
        }
        firstRender.current = false
    }, [searchKey])

    const onReloadActivities = () => {
        if (page === 0) {
            onGetActivities()
        } else {
            setPage(0)
        }
    }

    const onGetActivities = async () => {
        setIsLoading(() => true)
        try {
            const data = await getActivities(page, searchKey)
            setTotalPages(data.totalPages)
            const tableData: TableCell[] = []
            data.content.map((dataElement) => tableData.push({ displayFields: [dataElement.name, dataElement.size.toString()], realEntity: dataElement }))
            if (data.content.length < 1 && page > 1) {
                setPage((old) => old - 1)
            }
            setTableData(tableData)
            setIsLoading(() => false)
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.cause === StatusCode.ClientErrorForbidden) {
                    snackbar.onOpen('Your session has expired', 'cancel', 'error')
                    logout()
                }
            } else {
                snackbar.onOpen('An internal error has occurred', 'cancel', 'error')
            }
            setIsLoading(false)
        }
    }

    const onCreateActivity = () => {
        setCreateActivityModalVisible(true)
    }

    const onUpdateActivity = (id: string) => {
        setActivityForEdit(id)
        setCreateActivityModalVisible(true)
    }

    const onCloseCreateActivityModal = () => {
        setActivityForEdit(undefined)
        setCreateActivityModalVisible(false)
    }

    const onPrepareDelete = (activities: string[]) => {
        setActivitiesForDelete(activities)
        setConfirmDeleteModalVisible(true)
    }

    const onDelete = async () => {
        await deleteActivities(activitiesForDelete)
        triggerReloadActivities()
        setActivitiesForDelete([])
        setConfirmDeleteModalVisible(false)
    }

    const onCloseDeleteConfirmationModal = () => {
        setActivitiesForDelete([])
        setConfirmDeleteModalVisible(false)
    }



    const contextOptions: ContextOption[] = [{
        label: 'Edit',
        icon: 'edit',
        onClick: (elements: unknown[]) => {
            const activities = elements as Activity[]
            onUpdateActivity(activities[0].id)
        }
    }, {
        label: 'Delete',
        icon: 'delete',
        isMulti: true,
        onClick: (elements: unknown[]) => {
            const activities = elements as Activity[]
            onPrepareDelete(activities.map((activity) => activity.id))
        }
    }]

    return (
        <VilaLayout>
            <div className='flex w-full flex-col h-[65vh]'>
                <VilaTable headers={headers} data={tableData} isLoading={isLoading} buttons={[<VilaButton icon='add' font='lightFont' onClick={() => onCreateActivity()} >{'Add activity'}</VilaButton>]}
                    searchKey={searchKey} setSearchKey={setSearchKey} contextOptions={contextOptions} />
                <VilaPagination page={page} setPage={setPage} totalPages={totalPages} maxVisiblePages={10} />
            </div>
            <>{createActivityModalVisible && <CreateActivityModal activityId={activityForEdit} onClose={() => onCloseCreateActivityModal()} />}</>
            <>{confirmDeleteModalVisible && <ConfirmationModal onClick={() => onDelete()} onClose={() => onCloseDeleteConfirmationModal()} label='These activities will be deleted. Are you sure?' />}</>

        </VilaLayout>
    )
}
