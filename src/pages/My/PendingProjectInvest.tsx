import { useMyService } from '@/core/services/my.service'
import { ProjectInvestListDTO } from '@/core/services/project_invest.service'
import { Button, Empty, List } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const PendingProjectInvest = () => {
    const myService = useMyService()
    const [projectInvest, setProjectInvest] = useState<ProjectInvestListDTO[]>([])
    const n = useNavigate()

    useEffect(() => {
        myService.getPendingProjectInvest().subscribe((res) => {
            setProjectInvest(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">待填报进度</div>
            <div className="p-20px">
                {projectInvest.map((e) => {
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
                                <div className="flex justify-between">
                                    <div> {e.days}</div>
                                    <div> {e.projectName}</div>
                                </div>
                            </List.Item>
                        </List>
                    )
                })}
            </div>
        </div>
    )
}
