import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/staging'

export type StagingDetailDTO = {
    speedOfProgress: string
    stageCount: number
    taskCount: number
    warningCount: number
    earlyWarningCount: number
    favoriteCount: number
    superviseCount: number
    problemCount: number
}

export const useStagingService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const getStagingDetail = (id: string) =>
        http.get<RemoteResultDTO<StagingDetailDTO>>(`${path}/project_detail`)

    const getMyTask = () =>
        http.post<RemoteResultDTO<any>>(`${path}/my_task`, {
            index: 1,
            size: 10,
            status: 'NOTSTART'
        })

    const getProblemPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: any[]
                    total: number
                }>
            >(`${path}/need_deal_problem`, newPageConfig)
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

    const getMyProblemPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: any[]
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
    return {
        getStagingDetail,
        getProblemPagedList,
        getMyProblemPagedList,
        getMyTask
    }
}
