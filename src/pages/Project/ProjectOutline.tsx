import { AppProjectDetailDTO, ProjectDTO, useProjectService } from '@/core/services/project.service'
import { StagingDetailDTO, useStagingService } from '@/core/services/staging.service'
import { Card } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FavoriteImg from './img/favorite.png'
import UnfavoriteImg from './img/unfavorite.png'
import { AllTree } from './components/AllTree'
import { ProjectInvestList } from './components/ProjectInvestList'
import { Switch } from '@/shared/components/control/Switch'
import { Match } from '@/shared/components/control/Match'
import { ProjectCommentsView } from './components/ProjectComments'
import { ProjectProblemView } from './components/ProjectProblem'

export const ProjectOutlineView = () => {
    const { id } = useParams()
    const projectService = useProjectService()
    const [stagingDetail, setStagingDetail] = useState<AppProjectDetailDTO>({
        speedOfProgress: '',
        stageCount: 0,
        taskCount: 0,
        warningCount: 0,
        earlyWarningCount: 0,
        favoriteCount: 0,
        superviseCount: 0,
        problemCount: 0,
        taskCompletedNum: 0,
        taskTotalNum: 0,
        imageAmountTotal: 0,
        plannedAmountTotal: 0,
        videoLinkNum: 0
    })

    const [projectDetail, setProjectDetail] = useState<ProjectDTO>()
    const [type, setType] = useState<string>('节点进度')
    const n = useNavigate()
    useEffect(() => {
        projectService.getAppProjectDetail(id || '').subscribe((res) => {
            setStagingDetail(res.data)
        })
        projectService.getProjectDetail(id || '').subscribe((res) => {
            setProjectDetail(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">项目概览</div>
            <Card className="m-2 text-[16px]">
                <div className="flex mb-1">
                    <div className="w-96px">项目名称：</div>
                    <div
                        onClick={() => {
                            n(`/project-detail/${projectDetail?.id}`)
                        }}
                        className="font-bold text-center flex-1 truncate underline"
                    >
                        {projectDetail?.name}
                    </div>
                    <img
                        className="w-28px ml-2"
                        src={projectDetail?.isFavorite ? FavoriteImg : UnfavoriteImg}
                        alt=""
                    />
                </div>
                <div className="flex mb-1">
                    <div className="w-96px">项目阶段数：</div>
                    <div className="font-bold text-center flex-1">{stagingDetail?.stageCount}</div>
                </div>
                <div className="flex mb-1">
                    <div className="w-96px">节点进度：</div>
                    <div
                        onClick={() => {
                            setType('节点进度')
                        }}
                        className="font-bold text-center flex-1 underline"
                    >
                        {`${stagingDetail?.taskCompletedNum || 0}个 / ${
                            stagingDetail?.taskTotalNum || 0
                        }个`}
                        <span className="ml-2">
                            {(
                                (stagingDetail?.taskCompletedNum ||
                                    0 / stagingDetail?.taskTotalNum ||
                                    0) * 100
                            ).toFixed(2)}
                            %
                        </span>
                    </div>
                </div>
                <div className="flex mb-1">
                    <div className="w-96px">投资进度：</div>
                    <div
                        onClick={() => {
                            setType('投资进度')
                        }}
                        className="font-bold text-center flex-1 underline"
                    >
                        {`${stagingDetail?.plannedAmountTotal}万元 / ${stagingDetail?.imageAmountTotal}万元`}
                        <span className="ml-2">
                            {(
                                (stagingDetail!.plannedAmountTotal /
                                    stagingDetail!.imageAmountTotal) *
                                100
                            ).toFixed(2)}
                            %
                        </span>
                    </div>
                </div>
                <div className="flex mb-1">
                    <div className="w-96px">被批示次数：</div>
                    <div
                        onClick={() => {
                            setType('被批示次数')
                        }}
                        className="font-bold text-center flex-1 text-#f59a23 underline"
                    >
                        {stagingDetail?.superviseCount}
                    </div>
                </div>
                <div className="flex mb-1">
                    <div className="w-96px">问题个数：</div>
                    <div
                        onClick={() => {
                            setType('问题个数')
                        }}
                        className="font-bold text-center flex-1 text-#ff3127 underline"
                    >
                        {stagingDetail?.problemCount}
                    </div>
                </div>
                <div className="flex mb-1">
                    <div className="w-96px"> 视频链路数：</div>

                    <div className=" font-bold text-center flex-1 underline">
                        {stagingDetail?.videoLinkNum}
                    </div>
                </div>
            </Card>
            <div className="p-10px">
                <Switch>
                    <Match when={type === '节点进度'}>
                        <AllTree projectId={id || ''} />
                    </Match>
                    <Match when={type === '投资进度'}>
                        <ProjectInvestList
                            project={projectDetail as ProjectDTO}
                        ></ProjectInvestList>
                    </Match>
                    <Match when={type === '被批示次数'}>
                        <ProjectCommentsView
                            project={projectDetail as ProjectDTO}
                        ></ProjectCommentsView>
                    </Match>
                    <Match when={type === '问题个数'}>
                        <ProjectProblemView
                            project={projectDetail as ProjectDTO}
                        ></ProjectProblemView>
                    </Match>
                </Switch>
            </div>
        </div>
    )
}
