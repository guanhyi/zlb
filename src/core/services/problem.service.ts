import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/app/problem_coordination'

export type ProblemDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: null
    updatedBy: null
    projectId: string
    projectName: string
    taskId: string
    taskName: string
    declarationOrgId: string
    declarationContent: string
    declarationTime: string
    coordinationResult: string
    declarationOrgName: string
    inChargeMember: null
    flowList: FlowListItem[]
    coordinationResultName: string
}
type FlowListItem = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: null
    updatedBy: null
    flowNo: number
    flowName: string
    problemCoordinationId: string
    coordinator: string
    coordinationMethod: null
    coordinationResult: string
    coordinationResultRecord: string
    subordinateProblem: null
    coordinationTime: null
    coordinateOrgId: string
    coordinatorName: string
    coordinateOrgIdName: string
    coordinationResultName: string
}

export const useProblemService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const getProblem = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<ProblemDTO[]>>>(`${path}/get_paged_list`, {
            ...form
        })

    // 问题协调
    const createProblem = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<ProblemDTO[]>>>(`${path}/create`, {
            ...form
        })
    // 二级协调
    const getMyProblem = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<ProblemDTO[]>>>(`${path}/my_problem`, {
            ...form
        })

    // 分页查询
    const getProblemDetail = (id: string) => http.get<RemoteResultDTO<ProblemDTO>>(`${path}/${id}`)

    const updateCoordination = (form: any) =>
        http.put<RemoteResultDTO<ProblemDTO>>(`${path}/update_coordination`, { ...form })

    const getPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: ProblemDTO[]
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

        return {
            list: pageDataModule.records,
            total: pageDataModule.total
        }
    }

    const getMyPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: ProblemDTO[]
                    total: number
                }>
            >(`${path}/my_problem`, newPageConfig)
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
                    list: ProblemDTO[]
                    total: number
                }>
            >(`${path}/org_problem`, newPageConfig)
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
        getProblem,
        getProblemDetail,
        updateCoordination,
        getMyProblem,
        getPagedList,
        getMyPagedList,
        createProblem,
        getOrgPagedList
    }
}
