import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/task_dynamics'

export type TaskDynamicsDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: null
    updatedBy: null
    taskId: string
    type: number
    dynamics: string
    creator: Creator
}
interface Creator {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string
    updatedBy: string
    username: string
    accountId: string
    mobile: string
    loginCount: number
    orgId: string
    enabledStatus: number
    roleType: string
    eventRoleType: string
    shortIndex: number
    rolesList: RolesListItem[]
    isLeader: null
    orgName: string
}
interface RolesListItem {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string | null
    updatedBy: string | null
    name: string
    description: string | null
    roleType: number | null
}

export const useTaskDynamicsService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const getTaskDynamics = (taskId: string) =>
        http.get<RemoteResultDTO<TaskDynamicsDTO[]>>(`${path}/get_dynamics/${taskId}`)

    return {
        getTaskDynamics
    }
}
