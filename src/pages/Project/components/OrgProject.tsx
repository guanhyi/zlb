import { useAuthStore } from '@/core/services/auth.service'
import { ProjectDTO, useProjectService } from '@/core/services/project.service'
import { useProjectFavoriteService } from '@/core/services/project_favorite.service'
import { PageList, PageRef } from '@/shared/components/PageList'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteImg from '../img/favorite.png'
import UnfavoriteImg from '../img/unfavorite.png'
import { Button } from 'antd-mobile'

export const OrgProjectList = () => {
    const n = useNavigate()
    const pageListRef = useRef<PageRef>(null)
    const projectService = useProjectService()
    const projectFavoriteService = useProjectFavoriteService()

    const { user } = useAuthStore()

    const handleReload = () => {
        if (pageListRef.current) {
            pageListRef.current.reload() // 调用 reload 方法
        }
    }
    return (
        <div>
            {
                <PageList
                    ref={pageListRef}
                    className="h-100vh"
                    request={projectService.getOrgProjectPagedList}
                >
                    {(page: any) =>
                        page.map((e: ProjectDTO) => {
                            return (
                                <div
                                    key={e.id}
                                    className="bg-[#fff] py-15px px-12px  rounded-5px my-12px"
                                >
                                    <div
                                        onClick={() => {
                                            n(`/project-outline/${e.id}`)
                                        }}
                                        className="flex justify-between items-center text-[15px] text-[#333]"
                                    >
                                        <div className="truncate flex-1">{e.name}</div>
                                        <div className="flex items-center">
                                            <div className="text-#999 mx-4">{'详情'}</div>
                                            <img
                                                className="w-28px h-26px"
                                                src={e.isFavorite ? FavoriteImg : UnfavoriteImg}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-15px">
                                        <div className="text-[#2864e8] bg-[#EBF3FE] p-4px">
                                            {e.projectTagNameList[0]}
                                        </div>
                                        <div className="text-[13px] text-[#999]">
                                            投资进度：{e.plannedAmountTotal}/{e.imageAmountTotal}
                                            万元
                                        </div>
                                    </div>
                                    <div className="flex justify-between border-t-1px border-[#eee] mt-16px pt-12px">
                                        <Button
                                            block
                                            size="small"
                                            color="primary"
                                            className="mr-1"
                                            onClick={() => {
                                                n(`/update-clock/${e.id}`)
                                            }}
                                        >
                                            节点打卡
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                n(`/declare-problem/${e.id}`)
                                            }}
                                            block
                                            size="small"
                                            color="success"
                                            className="ml-1"
                                        >
                                            问题申报
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </PageList>
            }
        </div>
    )
}
