import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/station_message'

export type StationMessageDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: null
    updatedBy: null
    content: string
    contentId: string
    userId: string
    orgId: string
    sendTime: string
    type: number
    typeInfo: number
    projectId: string
    isRead: number
    isDeleted: number
}

export const useStationMessageService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const getStationMessage = (form: any) =>
        http.post<RemoteResultDTO<BaseRequestAPI.PageDTO<any[]>>>(`${path}/get_paged_list`, {
            ...form
        })

    const allReadStationMessage = () =>
        http.get<RemoteResultDTO<BaseRequestAPI.PageDTO<any[]>>>(`${path}/all_read`)

    const readStationMessage = (id: string) =>
        http.get<RemoteResultDTO<BaseRequestAPI.PageDTO<any[]>>>(`${path}/read`, { id: id })

    const getStationMessagePagedList = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        const pageData = await lastValueFrom(
            http.post<
                RemoteResultDTO<{
                    list: StationMessageDTO[]
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

    return {
        getStationMessage,
        getStationMessagePagedList,
        allReadStationMessage,
        readStationMessage
    }
}
