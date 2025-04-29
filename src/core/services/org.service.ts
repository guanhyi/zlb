import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'

const path = '/v1/app/org'

export type OrgDTO = {
    id: string
    name: string
    linkMan: null
    linkManTel: null
    shortIndex: null
    status: null
    orgType: string
    responsibleEmployeeCodes: string
    area: null
    children: OrgDTO[]
    level: number
    createdAt: string
    updatedAt: null
    orgLeaderList: any[]
    orgTypeName: string
    pid: string
    pname: null
}

export const useOrgService = () => {
    const http = useDependency(NgHttp)

    const getOrgTree = () => http.get<RemoteResultDTO<OrgDTO[]>>(`${path}/tree`)

    return {
        getOrgTree
    }
}
