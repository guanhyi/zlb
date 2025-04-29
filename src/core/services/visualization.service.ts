import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'

const path = '/app/visualization'

export const useVisualizationService = () => {
    const http = useDependency(NgHttp)

    // 投资完成率

    const getCompletionRate = (year:string) => http.get<any>(`${path}/completion_rate`,{year:year})

    // 获取跳转参数

    const getJumpParam = () => http.get<any>(`${path}/completion_rate`)

    // 获取已解决，督办问题

    const getStaticCounts = (year: string) =>
        http.get<any>(`${path}/get_static_counts`, { year: year })

    // 领导数据

    const getLeaderVision = () => http.get<any>(`${path}/leader_vision`)

    // 重大项目库情况

    const getMajorProjectSituation = (year: string) =>
        http.get<RemoteResultDTO<any>>(`${path}/major_project_situation`, { year: year })

    // 部门项目问题书

    const getOrgProjectAndProblem = () => http.get<any>(`${path}/org_project_and_problem`)

    return {
        getCompletionRate,
        getJumpParam,
        getStaticCounts,
        getLeaderVision,
        getMajorProjectSituation,
        getOrgProjectAndProblem
    }
}
