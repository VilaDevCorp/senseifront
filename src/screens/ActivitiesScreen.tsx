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
import { useApiError } from '../hooks/useApiError';
import { SizeIndicator } from '../components/atom/SizeIndicator';
import { ActivityIcon } from '../components/atom/ActivityIcon';
import { IconIndicator } from '../components/atom/IconIndicator';
import { VilaIcon } from '../components/ui/VilaIcon';
import { useDescriptionDialog } from '../hooks/useDescriptionDialog';
import { DescriptionDialog } from '../components/atom/DescriptionDialog';

export function ActivitiesScreen() {

    const headers = ['name', 'description', 'size', 'icon']


    const { getActivities, deleteActivities } = useApi();
    const snackbar = useSnackbar()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { setError } = useApiError({ navigate })

    const firstRender = useRef(true)
    const [page, setPage] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableCell[]>([])
    const { setIsLoading, reloadActivitiesFlag, triggerReloadActivities } = useMisc()
    const [searchKey, setSearchKey] = useState<string>('')
    const [createActivityModalVisible, setCreateActivityModalVisible] = useState<boolean>(false)
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState<boolean>(false)
    const [activityForEdit, setActivityForEdit] = useState<string | undefined>(undefined)
    const [activitiesForDelete, setActivitiesForDelete] = useState<string[]>([])
    const { onShowDescriptionDialog, onHideDescriptionDialog } = useDescriptionDialog()


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
        setIsLoadingTable(() => true)
        try {
            if (user === undefined) {
                return
            }
            const data = await getActivities(page, searchKey, user?.id)
            setTotalPages(data.totalPages)
            const tableData: TableCell[] = []
            data.content.map((dataElement) => tableData.push({
                displayFields: [dataElement.name, dataElement.description ,
                < SizeIndicator size={dataElement.size} />, <IconIndicator icon={dataElement.icon} />], realEntity: dataElement
            }))
            if (data.content.length < 1 && page > 1) {
                setPage((old) => old - 1)
            }
            setTableData(tableData)
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoadingTable(false)
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
        setIsLoading(() => true)
        try {
            await deleteActivities(activitiesForDelete)
            triggerReloadActivities()
            setActivitiesForDelete([])
            setConfirmDeleteModalVisible(false)
            snackbar.onOpen('Activities deleted!', 'delete', 'success')
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }
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
            <div className='flex w-full flex-col gap-4'>
                <div className='h-[45vh] min-h-[500px]'>
                    <VilaTable headers={headers} data={tableData} isLoading={isLoadingTable} buttons={[<VilaButton icon='add' font='lightFont' onClick={() => onCreateActivity()} >{'Add activity'}</VilaButton>]}
                        searchKey={searchKey} setSearchKey={setSearchKey} contextOptions={contextOptions} />
                </div>
                <div className='h-[50px]'>
                    <VilaPagination page={page} setPage={setPage} totalPages={totalPages} maxVisiblePages={10} />
                </div>

            </div>
            <DescriptionDialog />
            <>{createActivityModalVisible && <CreateActivityModal activityId={activityForEdit} onClose={() => onCloseCreateActivityModal()} />}</>
            <>{confirmDeleteModalVisible && <ConfirmationModal onClick={() => onDelete()} onClose={() => onCloseDeleteConfirmationModal()} label='These activities will be deleted. Are you sure?' />}</>

        </VilaLayout>
    )
}
