import { CommentsDTO, useCommentsService } from '@/core/services/comments.service'
import { ProjectDTO, useProjectService } from '@/core/services/project.service'
import { Match } from '@/shared/components/control/Match'
import { Switch } from '@/shared/components/control/Switch'
import { Empty, Loading, SpinLoading, Tabs } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const ProjectCommentsView = ({ project }: { project: ProjectDTO }) => {
    const commentsService = useCommentsService()
    const [projectList, setProjectList] = useState<CommentsDTO[]>([])
    const [loading, setLoading] = useState(false)

    const getData = (v?: string) => {
        setLoading(true)
        commentsService
            .getPagedList({ size: 10, index: 1, projectId: project.id })
            .subscribe((res) => {
                setLoading(false)
                setProjectList(res.data.records)
            })
    }
    const n = useNavigate()
    useEffect(() => {
        getData()
    }, [])
    return (
        <div>
            <Switch>
                <Match when={loading === true}>
                    <div className="flex items-center justify-center mt-300px">
                        <SpinLoading />
                    </div>
                </Match>
                <Match when={loading === false && projectList.length !== 0}>
                    {projectList.map((e) => {
                        return (
                            <div
                                key={e.id}
                                onClick={() => {
                                    n(`/comments-details/${e.id}`)
                                }}
                                className="bg-[#fff] py-15px px-12px  rounded-5px my-12px"
                            >
                                <div className="flex justify-between text-[15px] text-[#333]">
                                    <div>{e.instructionsContent}</div>
                                    <div>{'>'}</div>
                                </div>
                                <div className="flex justify-between items-center mt-15px">
                                    <div className="text-[#999]">{e.responsibleOrgName}</div>
                                </div>
                                <div className="flex justify-between  mt-16px py-11px px-12px bg-[#F8F8F8]">
                                    <div className=" flex text-13px items-center">
                                        <div className="text-20px text-[#2b64e8] mr-[5px]">·</div>
                                        <div className="text-[#999]">类型：</div>
                                        <div className="text-[#2b64e8]">{e.typeName}</div>
                                    </div>
                                    <div className="flex text-13px items-center">
                                        <div className=" text-20px text-[#FFA442] mr-[5px]">·</div>
                                        <div className="text-[#999]">状态：</div>
                                        <div className="text-[#FFA442]">{e.stateName}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Match>
                <Match when={loading === false && projectList.length === 0}>
                    <Empty description="暂无数据" />
                </Match>
            </Switch>
        </div>
    )
}
