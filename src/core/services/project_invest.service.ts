import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/project_invest'

export type ProjectInvest = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string
    updatedBy: string
    projectId: string
    days: string
    imageSchedule: string
    plannedAmount: number
    imageProgress: string
    imageAmount: number
    expenditureAmount: number
    existingProblem: null
    nextPlan: null
    otherSupplements: null
    attachment: string
    approvalStatus: string
    approvalDesc: string
    projectException: string
    projectExceptionDesc: string
    projectName: string
    rate: null
    governingOrgName: string
    projectExceptionName: string
    sysAttachments: null
    financingMethodName: null
    children: null
}

export type ProjectInvestCountDTO = {
    fasterProjects: number
    normal: number
    warning: number
    lagging: number
}

export type ProjectInvestListDTO = {
    id: string
    createdBy: null
    createdAt: null
    updatedAt: null
    updatedBy: null
    projectId: null
    days: string
    imageSchedule: string
    plannedAmount: number
    imageProgress: string
    imageAmount: number
    expenditureAmount: number
    existingProblem: null
    nextPlan: null
    otherSupplements: null
    attachment: null
    approvalStatus: null
    approvalDesc: null
    projectException: null
    projectExceptionDesc: null
    projectName: null
    rate: string
    governingOrgName: null
    projectExceptionName: null
    sysAttachments: null
    financingMethodName: null
    children: ProjectInvestDTO[]
}
export type ProjectInvestDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string | null
    updatedBy: string | null
    projectId: string
    days: string
    imageSchedule: string
    plannedAmount: number
    imageProgress: null | string
    imageAmount: number
    expenditureAmount: number
    existingProblem: null
    nextPlan: null | string
    otherSupplements: null
    attachment: null | string
    approvalStatus: string
    approvalDesc: null | string
    projectException: string | null
    projectExceptionDesc: string | null
    projectName: null
    rate: string
    governingOrgName: null
    projectExceptionName: null
    sysAttachments: null
    financingMethodName: null
    children: null
}

export const useProjectInvestService = () => {
    const http = useDependency(NgHttp)

    const getPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: ProjectInvest[]
                    total: number
                }>
            >(`${path}/get_paged_approval`, newPageConfig)
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

    /**
     * 发送钉消息-月报未填报时
     */

    const sendNotice = (id: string) => http.get<RemoteResultDTO<any>>(`${path}/send_notice/${id}`)

    const getPagedApprovalCount = (form: any) =>
        http.post<RemoteResultDTO<ProjectInvestCountDTO>>(`${path}/get_paged_approval_count`, {
            ...form
        })

    const getProjectInvestList = (projectId: string) =>
        http.post<RemoteResultDTO<ProjectInvestListDTO[]>>(`${path}/get_list/${projectId}`)

    const approvalInvest = (form: any) =>
        http.post<RemoteResultDTO<ProjectInvestListDTO[]>>(`${path}/approval`, { ...form })

    const getProjectInvestDetail = (id: string) =>
        http.get<RemoteResultDTO<ProjectInvestDTO>>(`${path}/${id}`)

    const updateProjectInvest = (form: any) =>
        http.put<RemoteResultDTO<ProjectInvestCountDTO>>(`${path}/update`, { ...form })

    return {
        getPagedList,
        sendNotice,
        getPagedApprovalCount,
        getProjectInvestDetail,
        getProjectInvestList,
        updateProjectInvest,
        approvalInvest
    }
}
