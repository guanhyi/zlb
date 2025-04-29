import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/grant_role'

export const useGrantRoleService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const getGrantRoleList = (form: any) =>
        http.get<RemoteResultDTO<BaseRequestAPI.PageDTO<any[]>>>(`${path}/get_list`, { ...form })

    // 分页查询
    const getMyGrant = () =>
        http.get<RemoteResultDTO<BaseRequestAPI.PageDTO<any[]>>>(`${path}/my_grant`)

    const createGrantRole = (form: any) =>
        http.post<RemoteResultDTO<any[]>>(`${path}/create`, { ...form })

    const deleteGrant = (id: string) => http.delete<RemoteResultDTO<any[]>>(`${path}/${id}`)

    return {
        getGrantRoleList,
        createGrantRole,
        getMyGrant,
        deleteGrant
    }
}
