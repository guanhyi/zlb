import { useVisualizationService } from "@/core/services/visualization.service"
import { useEffect, useState } from "react"
import styled from "styled-components"
import TitleBg from '@/assets/title-bg.png'
import { Pie } from '@ant-design/plots'

const Bg = styled.div`
    background: url(${TitleBg});
    background-size: contain;
    background-repeat: no-repeat;
    padding: 110px 14px 14px 14px;
    display: flex;
`
const Card = styled.div`
    width: 145px;
    height: 180px;
    background: linear-gradient(0deg, #2b64e8 0%, #73a8ff 100%);
    border-radius: 5px;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`

const RightCard = styled.div`
    width: 195px;
    height: 180px;

    background: #fff;
    border-radius: 5px;
    padding: 16px 12px;
    position: relative;
`
const PieContent = styled.div`
    position: absolute;
    top: -20px;
    left: 64px;
    width: 130px;
    height: 130px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`
export const OrgCard = ()=>{
    const visualizationService = useVisualizationService()
    const [orgProjectAndProblem, setOrgProjectAndProblem] = useState<any>({})

    useEffect(()=>{
  visualizationService.getOrgProjectAndProblem().subscribe((res) => {
            setOrgProjectAndProblem(res.data)
        })
    },[])
    const DemoPie = () => {
        const emptyTask =
            orgProjectAndProblem.totalTask -
            orgProjectAndProblem.earlyWarningTask -
            orgProjectAndProblem.warningTask -
            orgProjectAndProblem.instructionsSuperviseTask

        const config = {
            data: [
                { type: '总任务数', value: emptyTask, color: '#e1eaff' },
                {
                    type: '预警任务数',
                    value: orgProjectAndProblem.earlyWarningTask,
                    color: '#FFA442'
                },
                { type: '滞后任务数', value: orgProjectAndProblem.warningTask, color: '#FF0000' },
                {
                    type: '被批示任务数',
                    value: orgProjectAndProblem.instructionsSuperviseTask,
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
    return  <Bg className="flex justify-between">
                <Card>
                    <div className="flex justify-between">
                        <div className="text-13px text-[#adc2f8]">部门项目数</div>
                        <div className="flex items-center">
                            <div className="text-16px font-bold text-[#fff]">
                                {orgProjectAndProblem.orgProject}
                            </div>
                            <div className="text-13px text-[#adc2f8]">个</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-13px text-[#adc2f8]">上报问题数</div>
                        <div className="flex items-center">
                            <div className="text-16px font-bold text-[#fff]">
                                {orgProjectAndProblem.problemCoordination}
                            </div>
                            <div className="text-13px text-[#adc2f8]">个</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-13px text-[#adc2f8]">被批示的项目数</div>
                        <div className="flex items-center">
                            <div className="text-16px font-bold text-[#fff]">
                                {orgProjectAndProblem.instructionsSuperviseProject}
                            </div>
                            <div className="text-13px text-[#adc2f8]">个</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-13px text-[#adc2f8]">协调中问题数</div>
                        <div className="flex items-center">
                            <div className="text-16px font-bold text-[#fff]">
                                {orgProjectAndProblem.problemCoordinationProgress}
                            </div>
                            <div className="text-13px text-[#adc2f8]">个</div>
                        </div>
                    </div>
                </Card>
                <RightCard>
                    <div className="flex">
                        <div>
                            <div className="text-#102C6D text-16px">
                                {orgProjectAndProblem.totalTask}个
                            </div>
                            <div className="text-#666">总任务数</div>
                        </div>
                        <PieContent>
                            <DemoPie></DemoPie>
                        </PieContent>
                    </div>
                    <div className="mt-40px">
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div className="h-7px w-7px rounded-50% bg-#FFA442 mr-5px"></div>
                                <div>预警任务数</div>
                            </div>
                            <div className="text-#102C6D text-16px">
                                {orgProjectAndProblem.earlyWarningTask}个
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div className="h-7px w-7px rounded-50% bg-#FF0000 mr-5px"></div>
                                <div>滞后任务数</div>
                            </div>
                            <div className="text-#102C6D text-16px">
                                {orgProjectAndProblem.warningTask}个
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div className="h-7px w-7px rounded-50% bg-#2B64E8 mr-5px"></div>
                                <div>被批示任务数</div>
                            </div>
                            <div className="text-#102C6D text-16px">
                                {orgProjectAndProblem.instructionsSuperviseTask}个
                            </div>
                        </div>
                    </div>
                </RightCard>
            </Bg>
}