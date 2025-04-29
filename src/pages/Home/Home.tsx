import { useVisualizationService } from '@/core/services/visualization.service'
import { Pie } from '@ant-design/plots'
import { ProgressCircle } from 'antd-mobile'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { OrgCard } from './OrgCard'
import { LeaderCard } from './LeaderCard'
import { ACLService } from '@/core/services/acl.service'
import { Show } from '@/shared/components/control/Show'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { useNavigate } from 'react-router-dom'

const BigCard = styled.div`
    background: #ffffff;
    border-radius: 5px;
    margin: 14px;
    padding: 19px 0px;
`

const Title = styled.div`
    font-size: 16px;
    padding-left: 12px;
    border-left: 2px solid #2b64e8;
`

const SmallCard = styled.div`
    margin: 12px;
    border: 1px solid #e1eaff;
`

const SmallTitle = styled.div`
    background: linear-gradient(to right, #e1eaff, #fff);
    display: flex;
    justify-content: space-between;
    padding: 15px 12px;
`

export const HomeView = () => {
    const navigate = useNavigate()
    const visualizationService = useVisualizationService()
    const [majorProjectSituation, setMajorProjectSituation] = useState<any>({})
    const [staticCounts, setStaticCounts] = useState<any>({})
    const aclService = useDependency(ACLService)

    useEffect(() => {
        visualizationService.getMajorProjectSituation('2025').subscribe((res) => {
            setMajorProjectSituation(res.data || {})
        })
        visualizationService.getStaticCounts('2025').subscribe((res) => {
            setStaticCounts(res.data)
        })
    }, [])
    const handleProjectClick = (
        projectClassify?: string,
        type?: string,
        projectException?: string
    ) => {
        navigate('/project', {
            state: {
                projectType: type,
                projectException: projectException,
                projectClassify: projectClassify
            }
        })
    }

    return (
        <>
            <Show when={aclService.canAbilities('/app/home_01')}>
                <LeaderCard></LeaderCard>
            </Show>
            <Show when={aclService.canAbilities('/app/home_02')}>
                <OrgCard></OrgCard>
            </Show>
            <BigCard>
                <Title>重大项目库情况</Title>
                <SmallCard>
                    <SmallTitle>
                        <div className="text-15px text-#333333">重点建设项目</div>
                        <div className="text-18px font-bold">
                            {majorProjectSituation.constructionProject || 0}个
                        </div>
                    </SmallTitle>
                    <div className="p-12px">
                        <div className="flex justify-between px-40px py-8px">
                            <div className="flex flex-col items-center ">
                                <div className="text-13px text-#666666">年度计划投资</div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.planAmount || 0}万元
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-13px text-#666666">累计完成投资</div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.completeAmount || 0}万元
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-12px">
                            <div
                                onClick={() => {
                                    handleProjectClick('KEYPOINT', 'NewStartProject')
                                }}
                                className="bg-#f4f7ff p-16px flex flex-col items-center"
                            >
                                <div className="text-13px text-#666666 whitespace-nowrap">
                                    新开工项目
                                </div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.newStartProject || 0}个
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    handleProjectClick('KEYPOINT', 'StartedProjects')
                                }}
                                className="bg-#f4f7ff p-16px flex flex-col items-center"
                            >
                                <div className="text-13px text-#666666 whitespace-nowrap">
                                    已开工项目
                                </div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.startedProjects || 0}个
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    handleProjectClick('KEYPOINT', 'UnStartedProject')
                                }}
                                className="bg-#f4f7ff p-16px flex flex-col items-center"
                            >
                                <div className="text-13px text-#666666 whitespace-nowrap">
                                    未开工项目
                                </div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.unStartedProject || 0}个
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    handleProjectClick('KEYPOINT', 'CompletedProject')
                                }}
                                className="bg-#f4f7ff p-16px flex flex-col items-center"
                            >
                                <div className="text-13px text-#666666 whitespace-nowrap">
                                    已完工项目
                                </div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.completedProject || 0}个
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    handleProjectClick('KEYPOINT', '', '1659034440244043778')
                                }}
                                className="bg-#f4f7ff p-16px flex flex-col items-center"
                            >
                                <div className="text-13px text-#666666 whitespace-nowrap">
                                    滞后项目
                                </div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.constructionLaggingProject || 0}个
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    handleProjectClick('KEYPOINT', '', '1659034704506167297')
                                }}
                                className="bg-#f4f7ff p-16px flex flex-col items-center"
                            >
                                <div className="text-13px text-#666666 whitespace-nowrap">
                                    预警项目
                                </div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.constructionWarningProject || 0}个
                                </div>
                            </div>
                        </div>
                    </div>
                    <SmallTitle>
                        <div className="text-15px text-#333333">重大项目前期</div>
                        <div className="text-18px font-bold">
                            {majorProjectSituation.majorProject || 0}个
                        </div>
                    </SmallTitle>
                    <div className="p-12px">
                        <div className="grid grid-cols-3 gap-12px">
                            <div
                                onClick={() => {
                                    handleProjectClick('PROPHASE', '', '1659034440244043778')
                                }}
                                className="bg-#f4f7ff p-16px flex flex-col items-center"
                            >
                                <div className="text-13px text-#666666 whitespace-nowrap">
                                    滞后项目
                                </div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.majorLaggingProject || 0}个
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    handleProjectClick('PROPHASE', '', '1659034704506167297')
                                }}
                                className="bg-#f4f7ff p-16px flex flex-col items-center"
                            >
                                <div className="text-13px text-#666666 whitespace-nowrap">
                                    预警项目
                                </div>
                                <div className="text-16px font-bold">
                                    {majorProjectSituation.majorWarningProject || 0}个
                                </div>
                            </div>
                        </div>
                    </div>
                </SmallCard>
                <div className="bg-#EFF8F4 p-12px flex m-12px items-center">
                    <ProgressCircle
                        percent={Math.floor(
                            (staticCounts.resolvedProblem / staticCounts.totalProblem) * 100
                        )}
                        style={{
                            '--fill-color': '#21A967',
                            '--track-width': '6px',
                            '--size': '70px'
                        }}
                    >
                        <span className="text-#21A967">
                            {Math.floor(
                                (staticCounts.resolvedProblem / staticCounts.totalProblem) * 100
                            )}
                            %
                        </span>
                    </ProgressCircle>
                    <div className="py-11px px-28px">
                        <div className="text-13px text-#666666 mb-10px">已解决问题</div>
                        <div className="flex items-center">
                            <div className=" text-16px font-bold text-#21a967 mr-1">
                                {staticCounts.resolvedProblem}
                            </div>
                            <span>个</span>
                        </div>
                    </div>
                    <div className="py-11px px-28px">
                        <div className="text-13px text-#666666 mb-10px">申报问题</div>
                        <div className="flex items-center">
                            <div className=" text-16px font-bold text-#21a967 mr-1">
                                {staticCounts.totalProblem}
                            </div>
                            <span>个</span>
                        </div>
                    </div>
                </div>
                <div className="bg-#FFFAF5 p-12px flex m-12px items-center">
                    <ProgressCircle
                        percent={Math.floor(
                            (staticCounts.endingSuperviseProject /
                                staticCounts.totalSuperviseProject) *
                                100 || 0
                        )}
                        style={{
                            '--fill-color': '#FFA442',
                            '--track-width': '6px',
                            '--size': '70px'
                        }}
                    >
                        <span className="text-#FFA442">
                            {(staticCounts.endingSuperviseProject /
                                staticCounts.totalSuperviseProject) *
                                100 || 0}
                            %
                        </span>
                    </ProgressCircle>
                    <div className="py-11px px-28px">
                        <div className="text-13px text-#666666 mb-10px">督办结束</div>
                        <div className="flex items-center">
                            <div className=" text-16px font-bold text-#FFA442 mr-1">
                                {staticCounts.endingSuperviseProject}
                            </div>
                            <span>个</span>
                        </div>
                    </div>
                    <div className="py-11px px-28px">
                        <div className="text-13px text-#666666 mb-10px ">被督办项目</div>
                        <div className="flex items-center">
                            <div className=" text-16px font-bold text-#FFA442 mr-1">
                                {staticCounts.totalSuperviseProject}
                            </div>
                            <span>个</span>
                        </div>
                    </div>
                </div>
            </BigCard>
        </>
    )
}
