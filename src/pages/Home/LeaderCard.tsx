import { useVisualizationService } from '@/core/services/visualization.service'
import { Pie } from '@ant-design/plots'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import TitleBg from '@/assets/title-bg.png'
import { useNavigate } from 'react-router-dom'

const Bg = styled.div`
    background: url(${TitleBg});
    background-size: contain;
    background-repeat: no-repeat;
    padding: 110px 14px 14px 14px;
    display: flex;
`
const Card = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 5px;
    padding: 16px 12px;
    position: relative;
`
const PieContent = styled.div`
    position: absolute;
    top: -20px;
    right: 10px;
    width: 130px;
    height: 130px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`
export const LeaderCard = () => {
    const visualizationService = useVisualizationService()
    const [leaderVision, setLeaderVision] = useState<any>({})
    const [completionRate, setCompletionRate] = useState<any>()
    useEffect(() => {
        visualizationService.getLeaderVision().subscribe((res) => {
            setLeaderVision(res.data)
        })
        visualizationService.getCompletionRate('2025').subscribe((res) => {
            setCompletionRate(parseFloat(res.data?.replace('%', '')) || 0)
        })
    }, [])
    const DemoPie = () => {
        const config = {
            data: [
                { type: '总任务数', value: 100 - completionRate, color: '#e1eaff' },
                {
                    type: '被批示任务数',
                    value: completionRate,
                    color: '#2B64E8'
                }
            ],
            style: {
                fill: ({ color }: any) => {
                    return color
                }
            },
            angleField: 'value',
            colorField: 'type',
            innerRadius: 0.75,
            legend: false
        }
        return <Pie {...config} />
    }
    const navigate = useNavigate()

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
        <Bg className="flex justify-between">
            <Card>
                <div className="flex">
                    <div>
                        <div className="text-#102C6D text-24px">{completionRate}%</div>
                        <div className="text-#666 text-15px">投资完成率</div>
                    </div>
                    <PieContent>
                        <DemoPie></DemoPie>
                    </PieContent>
                </div>
                <div className="mt-40px pt-15px grid grid-cols-2 gap-x-4 gap-y-2 border-t-1px border-#e1eaff">
                    <div
                        onClick={() => {
                            navigate('/project', { state: { type: 'lead' } })
                        }}
                        className="flex justify-between"
                    >
                        <div className="flex items-center">
                            <div className="h-7px w-7px rounded-50% bg-#2B64E8 mr-5px"></div>
                            <div>领办项目</div>
                        </div>
                        <div className="text-#102C6D text-16px">
                            {leaderVision?.leadProject || 0}个
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            handleProjectClick('PROPHASE', '', '1659034440244043778')
                        }}
                        className="flex justify-between"
                    >
                        <div className="flex items-center">
                            <div className="h-7px w-7px rounded-50% bg-#2B64E8 mr-5px"></div>
                            <div>滞后预警项目</div>
                        </div>
                        <div className="text-#102C6D text-16px">
                            {leaderVision?.warningProject || 0}个
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            navigate('/comments')
                        }}
                        className="flex justify-between"
                    >
                        <div className="flex items-center">
                            <div className="h-7px w-7px rounded-50% bg-#2B64E8 mr-5px"></div>
                            <div>已反馈批示</div>
                        </div>
                        <div className="text-#102C6D text-16px">
                            {leaderVision?.instructionsFeedbacks || 0}个
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            navigate('/problem')
                        }}
                        className="flex justify-between"
                    >
                        <div className="flex items-center">
                            <div className="h-7px w-7px rounded-50% bg-#2B64E8 mr-5px"></div>
                            <div>待协调任务</div>
                        </div>
                        <div className="text-#102C6D text-16px">
                            {leaderVision?.waitProblemCoordination || 0}个
                        </div>
                    </div>
                </div>
            </Card>
        </Bg>
    )
}
