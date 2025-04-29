import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/app/instructions_supervise'

export type CommentsDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string
    updatedBy: string
    projectId: string
    taskId: null
    type: string
    instructionsTo: string
    instructionsContent: string
    leader: string
    instructionsTime: string
    responsibleOrg: string
    responsibleUser: null
    toOrg: null
    state: string
    projectName: string
    taskName: null
    leaderName: string
    responsibleOrgName: string
    responsibleUserName: null
    toOrgName: null
    feedBackList: FeedBackListItem[]
    typeName: string
    stateName: string
}
interface FeedBackListItem {
    id: string
    createdBy: null
    createdAt: null
    updatedAt: null
    updatedBy: null
    instructionsSuperviseId: string
    responsibleOrg: null
    responsibleUser: null
    feedbackContent: null
    feedbackTime: null
    state: string
    responsibleOrgName: null
    responsibleUserName: null
    stateName: string
}

export const useCommentsService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const myPagedList = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<CommentsDTO[]>>>(`${path}/my_paged_list`, {
            ...form
        })

    // 分页查询
    const feedback = (form: any) =>
        http.put<RemoteResultDTO<BaseRequestAPI.PageDTO<CommentsDTO[]>>>(
            `${path}/feedback/update`,
            {
                ...form
            }
        )

    // 分页查询
    const createComments = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<CommentsDTO[]>>>(`${path}/create`, {
            ...form
        })
    // 分页查询
    const getPagedList = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<CommentsDTO[]>>>(
            `${path}/get_paged_list`,
            {
                ...form
            }
        )

    const getMyPagedInstruction = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<CommentsDTO[]>>>(
            `${path}/get_instructions`,
            {
                ...form
            }
        )

    // 分页查询
    const otherInstruction = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<CommentsDTO[]>>>(
            `${path}/other_instruction`,
            {
                ...form
            }
        )

    // 分页查询
    const getOrgInstructions = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<CommentsDTO[]>>>(
            `${path}/get_org_instructions`,
            {
                ...form
            }
        )

    // 分页查询
    const getDetails = (id: string) => http.get<RemoteResultDTO<CommentsDTO>>(`${path}/${id}`)

    const getMyPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: CommentsDTO[]
                    total: number
                }>
            >(`${path}/my_paged_list`, newPageConfig)
        )

        const pageDataModule = z
            .object({
                records: z.array(z.any()).default([]),
                total: z.any().default(0)
            })
            .parse(pageData.data)

        return {
            list: pageDataModule.records,
            total: pageDataModule.total
        }
    }
    const getOtherPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: CommentsDTO[]
                    total: number
                }>
            >(`${path}/other_instruction`, newPageConfig)
        )

        const pageDataModule = z
            .object({
                records: z.array(z.any()).default([]),
                total: z.any().default(0)
            })
            .parse(pageData.data)

        return {
            list: pageDataModule.records,
            total: pageDataModule.total
        }
    }

    const getOrgPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: CommentsDTO[]
                    total: number
                }>
            >(`${path}/get_org_instructions`, newPageConfig)
        )

        const pageDataModule = z
            .object({
                records: z.array(z.any()).default([]),
                total: z.any().default(0)
            })
            .parse(pageData.data)

        return {
            list: pageDataModule.records,
            total: pageDataModule.total
        }
    }

    const getInstructionPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: CommentsDTO[]
                    total: number
                }>
            >(`${path}/get_instructions`, newPageConfig)
        )

        const pageDataModule = z
            .object({
                records: z.array(z.any()).default([]),
                total: z.any().default(0)
            })
            .parse(pageData.data)

        return {
            list: pageDataModule.records,
            total: pageDataModule.total
        }
    }
    return {
        myPagedList,
        getDetails,
        otherInstruction,
        getOrgInstructions,
        getPagedList,
        createComments,
        getMyPagedInstruction,
        getMyPagedList,
        getOtherPagedList,
        getOrgPagedList,
        getInstructionPagedList,
        feedback
    }
}
