import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/task'

export type TaskDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string
    updatedBy: string
    projectId: string
    name: string
    stageId: string
    eventCode: string
    parentId: string
    governingOrg: string
    deadline: string
    startTime: string
    endTime: string
    actualFinishTime: null
    inChargeMember: string
    personLiable: string
    reminderTime: string
    reminderTimeFormat: string
    warningTime: string
    warningTimeFormat: string
    status: string
    warningStatus: string
    approvalResults: string
    completeApprovalStatus: string
    completeApprovalResults: null
    shortIndex: number
    projectName: string
    stageName: string
    governingOrgName: string
    isDing: null
}

export type AllTreeDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: null
    updatedBy: null
    projectId: string
    name: string
    shortIndex: number
    tasks: TasksItem[]
}
export type TasksItem = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string
    updatedBy: string
    projectId: string
    name: string
    stageId: string
    eventCode: string
    parentId: string
    governingOrg: string
    deadline: string
    startTime: string
    endTime: string
    actualFinishTime: string | null
    inChargeMember: string
    personLiable: null
    reminderTime: string
    reminderTimeFormat: string
    warningTime: string
    warningTimeFormat: string
    status: string
    warningStatus: string
    approvalResults: string
    completeApprovalStatus: string
    completeApprovalResults: string | null
    shortIndex: number
    children: null
    deliverables: DeliverablesDTO[]
    governingOrgName: string
    parentName: string
    level: number
    inChargeMemberName: null
    personLiableName: null
    stageName: null
    projectName: null
    advanceCompletionEndTime: null
    statusName: string
}

export type DeliverablesDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string
    updatedBy: string
    title: string
    isSubmitted: string
    isDeleted: string
    taskId: string
    type: string
    content: string
    sysAttachments: SysAttachments
}
interface SysAttachments {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: null
    updatedBy: null
    title: string
    path: string
    additionExt: string
    fileType: null
    short_index: null
    fileSize: number
    md5: string
    isDeleted: null
    adminUser: null
    url: null
}

export const useTaskService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const getTaskList = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<TaskDTO[]>>>(`${path}/get_paged_list`, {
            ...form
        })


    const approvalTask = (form: any) =>
        http.put<RemoteResultDTO<BaseRequestAPI.PageDTO<TaskDTO[]>>>(`${path}/approval`, {
            ...form
        })


    const approvalCompleteTask = (form: any) =>
        http.put<RemoteResultDTO<BaseRequestAPI.PageDTO<TaskDTO[]>>>(`${path}/complete_approval`, {
            ...form
        })

        



    // 分页查询
    const getTaskDetail = (id: string) => http.get<RemoteResultDTO<TasksItem>>(`${path}/${id}`)

    const getPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: TaskDTO[]
                    total: number
                }>
            >(`${path}/get_paged_list`, newPageConfig)
        )

        const pageDataModule = z
            .object({
                records: z.array(z.any()).default([]),
                total: z.any().default(0)
            })
            .parse(pageData.data)
        console.log(pageDataModule)

        return {
            list: pageDataModule.records,
            total: pageDataModule.total
        }
    }

    const getAllTree = (projectId: string) =>
        http.post<RemoteResultDTO<AllTreeDTO[]>>(`${path}/allTree/${projectId}`)

    return {
        getTaskList,
        getPagedList,
        getTaskDetail,
        getAllTree,
        approvalTask,
        approvalCompleteTask
    }
}
