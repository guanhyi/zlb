import { ProjectDTO } from '@/core/services/project.service'
import {
    ProjectInvestCountDTO,
    ProjectInvestListDTO,
    useProjectInvestService
} from '@/core/services/project_invest.service'
import { Button, Card, List } from 'antd-mobile'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const ProjectInvestPage = () => {
    const { id } = useParams()
    const projectInvestService = useProjectInvestService()
    const [projectInvest, setProjectInvest] = useState<ProjectInvestListDTO[]>([])
    const n = useNavigate()
    useEffect(() => {
        projectInvestService.getProjectInvestList(id || '').subscribe((res) => {
            setProjectInvest(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] ">
            <div className="text-20px p-10px bg-[#fff]">项目月报</div>
            <div className="p-20px">
                {projectInvest.map((parent) => {
                    return (
                        <List key={parent.id}>
                            {parent.children.map((e) => {
                                return (
                                    <List key={e.id}>
                                        <List.Item
                                            className="mb-2"
                                            description={
                                                <div>
                                                    <div>
                                                        <div>形象进度计划：{e.imageSchedule}</div>
                                                    </div>
                                                    <div>
                                                        <span className="mr-2">
                                                            计划投资金额：{e.plannedAmount}万元
                                                        </span>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            n(`/project-invest-form/${e.id}`)
                                                        }}
                                                        className="my-2"
                                                        block
                                                        color="primary"
                                                        size="mini"
                                                    >
                                                        月报填报
                                                    </Button>
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
        </div>
    )
}
