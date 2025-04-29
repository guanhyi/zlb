import { useTaskService, AllTreeDTO } from '@/core/services/task.service'
import { List, Button } from 'antd-mobile'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const UpdateClockView = () => {
    const taskService = useTaskService()
    const { id } = useParams()
    const [allTree, setAllTree] = useState<AllTreeDTO[]>([])
    const n = useNavigate()
    useEffect(() => {
        taskService.getAllTree(id || '').subscribe((res) => {
            setAllTree(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">项目节点</div>
            <div className="p-20px">
                {allTree.map((parent) => {
                    return (
                        <List key={parent.id}>
                            {parent.tasks !== null &&
                                parent.tasks.map((e) => {
                                    return (
                                        <List key={e.id}>
                                            <List.Item
                                                className="mb-2"
                                                description={
                                                    <div>
                                                        <div>
                                                            <div>{e.projectName}</div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between  mt-16px py-11px px-12px bg-[#F8F8F8]">
                                                                <div className=" flex text-13px items-center">
                                                                    <div className="text-20px text-[#2b64e8] mr-[5px]">
                                                                        ·
                                                                    </div>
                                                                    <div className="text-[#999] whitespace-nowrap">
                                                                        截止时间：
                                                                    </div>
                                                                    <div className="text-[#2b64e8] whitespace-nowrap">
                                                                        {dayjs(
                                                                            e.warningTimeFormat
                                                                        ).format(
                                                                            'YYYY-MM-DD HH:mm'
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex text-13px items-center">
                                                                    <div className=" text-20px text-[#FFA442] mr-[5px]">
                                                                        ·
                                                                    </div>
                                                                    <div className="text-[#999] whitespace-nowrap">
                                                                        状态：
                                                                    </div>
                                                                    <div className="text-[#FFA442] whitespace-nowrap">
                                                                        {e.statusName}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex my-2">
                                                            <Button
                                                                onClick={() => {
                                                                    n(`/update-clock-form/${e.id}`)
                                                                }}
                                                                className="mr-1"
                                                                block
                                                                color="primary"
                                                                size="mini"
                                                            >
                                                                节点打卡
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    n(
                                                                        `/declare-problem/${e.projectId}`
                                                                    )
                                                                }}
                                                                className="ml-1"
                                                                block
                                                                color="success"
                                                                size="mini"
                                                            >
                                                                问题申报
                                                            </Button>
                                                        </div>
                                                    </div>
                                                }
                                                key={e.id}
                                            >
                                                {e.name}
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
