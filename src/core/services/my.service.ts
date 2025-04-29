import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'

const path = '/v1/app/my'

export const useMyService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const getPendingProcessing = () => http.get<any>(`${path}/pending_processing`)

    const getPendingProjectInvest = () => http.get<any>(`${path}/pending_project_invest`)

    const getPendingTask = () => http.get<any>(`${path}/pending_task`)

    return {
        getPendingProcessing,
        getPendingProjectInvest,
        getPendingTask
    }
}
