import { NgHttp } from '@/shared/http/client'
import { useDependency } from '@wendellhu/redi/react-bindings'

const path = '/app/project_favorite'

export const useProjectFavoriteService = () => {
    const http = useDependency(NgHttp)

    // 分页查询
    const createFavorite = (projectId: string, userId: string) =>
        http.post<RemoteResultDTO<any>>(`${path}/create`, { projectId: projectId, userId: userId })

    const cancelFavorite = (projectId: string) =>
        http.delete<RemoteResultDTO<any>>(`${path}/cancel/`, { projectId: projectId })

    return {
        createFavorite,
        cancelFavorite
    }
}
