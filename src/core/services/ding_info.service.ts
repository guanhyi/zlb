import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/ding_info'

export type DingInfoDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: string
    updatedBy: string
    userId: null
    projectId: string
    startTime: string
    endTime: string
    allClose: number
    isDeleted: number
    projectName: string
    isOpen: number
}

export const useDingInfoService = () => {
    const http = useDependency(NgHttp)

    // 投资完成率

    const getDictList = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<DingInfoDTO[]>>>(`${path}/manage_paged`, {
            ...form
        })

    const deleteDingInfo = (ids: any) =>
        http.delete<RemoteResultDTO<BaseRequestAPI.PageDTO<DingInfoDTO[]>>>(`${path}/${ids}`)

    const batchCreate = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<DingInfoDTO[]>>>(`${path}/batch_create`, {
            ...form
        })

    const getDingInfoPagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: DingInfoDTO[]
                    total: number
                }>
            >(`${path}/manage_paged`, newPageConfig)
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

    return {
        getDictList,
        getDingInfoPagedList,
        batchCreate,
        deleteDingInfo
    }
}
