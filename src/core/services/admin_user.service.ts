import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'

const path = '/v1/app/admin_user'

export const useAdminUserService = () => {
    const http = useDependency(NgHttp)

    const getAdminUserByOrg = (form: any) =>
        http.get<RemoteResultDTO<any[]>>(`${path}/get_by_org`, { ...form })

    return {
        getAdminUserByOrg
    }
}
