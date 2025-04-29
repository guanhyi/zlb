import { ProjectDTO } from '@/core/services/project.service'
import {
    ProjectInvestCountDTO,
    ProjectInvestListDTO,
    useProjectInvestService
} from '@/core/services/project_invest.service'
import { Button, Card, List } from 'antd-mobile'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export const ProjectInvestList = ({ project }: { project: ProjectDTO }) => {
    const projectInvestService = useProjectInvestService()
    const [projectInvest, setProjectInvest] = useState<ProjectInvestListDTO[]>([])
    useEffect(() => {
        projectInvestService.getProjectInvestList(project.id).subscribe((res) => {
            setProjectInvest(res.data)
        })
    }, [])
    return (
        <div>
            {/* <Card>
                <div className="flex mb-1">
                    <div className="w-96px">项目名称：</div>
                    <div className="font-bold text-center flex-1 truncate">{project?.name}</div>
                </div>
                <div className="flex mb-1">
                    <div className="w-96px">计划投资金额：</div>
                    <div className="font-bold text-center flex-1 truncate">{project?.name}</div>
                </div>
                <div className="flex mb-1">
                    <div className="w-96px">形象投资金额：</div>
                    <div className="font-bold text-center flex-1 truncate">{project?.name}</div>
                </div>
                <div className="flex mb-1">
                    <div className="w-96px">财务投资金额：</div>
                    <div className="font-bold text-center flex-1 truncate">{project?.name}</div>
                </div>
            </Card> */}
            {projectInvest.map((parent) => {
                return (
                    <List key={parent.id}>
                        <List.Item>{parent.days}</List.Item>
                        {parent.children.map((e) => {
                            return (
                                <List key={e.id}>
                                    <List.Item
                                        description={
                                            <div>
                                                <div>
                                                    <div>计划：{e.imageSchedule}</div>
                                                </div>
                                                <div>
                                                    <div>形象：{e.imageProgress}</div>
                                                </div>
                                                <div>
                                                    <span className="mr-2">
                                                        计划：{e.plannedAmount}万元
                                                    </span>
                                                    <span>形象：{e.imageAmount}万元</span>
                                                </div>
                                            </div>
                                        }
                                        key={e.id}
                                    >
                                        {e.days}
                                    </List.Item>
                                </List>
                            )
                        })}
                    </List>
                )
            })}
        </div>
    )
}
