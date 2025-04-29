import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/project'

export type ProjectDTO = {
    id: string
    name: string
    classify: string
    governingOrg: string
    governingOrgName: string
    buildOrg: string
    indicationNum: number
    problemNum: number
    taskCompletedNum: number
    taskTotalNum: number
    imageAmountTotal: number
    plannedAmountTotal: number
    projectException: string
    startYear: number
    endYear: number
    isFavorite: boolean
    inChargeMember: string
    inChargeMemberName: null
    projectStage: string
    projectTag: string
    projectTagNameList: string[]
}

export type AppProjectDetailDTO = {
    speedOfProgress: string
    stageCount: number
    taskCount: number
    warningCount: number
    earlyWarningCount: number
    favoriteCount: number
    superviseCount: number
    problemCount: number
    taskCompletedNum: number
    taskTotalNum: number
    imageAmountTotal: number
    plannedAmountTotal: number
    videoLinkNum: number
}

export type MenusCountDTO = {
    menus: string
    count: number
}

export type TownVillageDTO = {
    id: string
    year: string
    deptId: null
    deptName: string
    inChargeMember: string
    projectName: string
    content: string
    totalInvestment: number
    progress: string
    progressEvaluation: string
    remark: null
    status: null
    completeInvestment: null
}

export const useProjectService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const allProject = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<ProjectDTO[]>>>(`${path}/all_project`, {
            ...form
        })

    // 分页查询
    const LeadProject = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<ProjectDTO[]>>>(`${path}/lead_project`, {
            ...form
        })

    // 分页查询
    const ProjectMenusCount = () =>
        http.get<RemoteResultDTO<MenusCountDTO[]>>(`${path}/project_menus_count`)

    const getProjectDetail = (id: string) => http.get<RemoteResultDTO<ProjectDTO>>(`${path}/${id}`)

    // 分页查询
    const updateProject = (form: any) =>
        http.put<RemoteResultDTO<BaseRequestAPI.PageDTO<ProjectDTO[]>>>(`${path}/update`, {
            ...form
        })

    const getPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: ProjectDTO[]
                    total: number
                }>
            >(`${path}/all_project`, newPageConfig)
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

    const getMyPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: ProjectDTO[]
                    total: number
                }>
            >(`${path}/my_project`, newPageConfig)
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

    const getTownVillagePagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            townVillageType: 1,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: TownVillageDTO[]
                    total: number
                }>
            >(`${path}/town_village_project`, newPageConfig)
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

    const getLeadPagedList = async ({ current, pageSize, url, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            townVillageType: 1,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: TownVillageDTO[]
                    total: number
                }>
            >(`${path}/lead_project`, newPageConfig)
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

    const getMyFavoritePagedList = async ({ current, pageSize, url, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            townVillageType: 1,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: TownVillageDTO[]
                    total: number
                }>
            >(`${path}/my_favorite`, newPageConfig)
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

    const getOrgProjectPagedList = async ({ current, pageSize, url, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            townVillageType: 1,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: TownVillageDTO[]
                    total: number
                }>
            >(`${path}/org_project`, newPageConfig)
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

    const getAppProjectDetail = (id: string) =>
        http.get<RemoteResultDTO<AppProjectDetailDTO>>(`${path}/app_project_detail`, { id: id })

    return {
        allProject,
        LeadProject,
        ProjectMenusCount,
        updateProject,
        getProjectDetail,
        getPagedList,
        getAppProjectDetail,
        getMyPagedList,
        getTownVillagePagedList,
        getLeadPagedList,
        getMyFavoritePagedList,
        getOrgProjectPagedList
    }
}
