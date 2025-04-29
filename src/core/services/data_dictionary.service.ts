import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'

const path = '/app/data_dictionary'

export type DictDTO = {
    id: string
    createdBy: string
    createdAt: string
    updatedAt: null | string
    updatedBy: null | string
    pid: string
    module: string
    code: string
    name: string
    remark: string
    shortIndex: number
}

export const useDataDictionaryService = () => {
    const http = useDependency(NgHttp)

    // 投资完成率

    const getDictList = (form: any) =>
        http.get<RemoteResultDTO<DictDTO[]>>(`${path}/list`, { ...form })

    const getDictPage = () =>
        http.post<RemoteResultDTO<any>>(`${path}/get_paged_list`, { index: 1, size: 99 })

    return {
        getDictList,
        getDictPage
    }
}
