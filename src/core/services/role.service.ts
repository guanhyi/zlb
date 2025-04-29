import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { lastValueFrom } from 'rxjs'
import { z } from 'zod'

const path = '/v1/app/roles'

export const useRolesService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const getMyRole = () => http.get<RemoteResultDTO<any[]>>(`${path}/get_my_role`)

    return {
        getMyRole
    }
}
