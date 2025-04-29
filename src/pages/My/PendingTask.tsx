import { useMyService } from '@/core/services/my.service'
import { useStagingService } from '@/core/services/staging.service'
import { AllTreeDTO } from '@/core/services/task.service'
import { Button, Empty, List } from 'antd-mobile'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const PendingTask = () => {
    const myService = useMyService()
    const stagingService = useStagingService()
    const [allTree, setAllTree] = useState<any[]>([])
    const n = useNavigate()

    useEffect(() => {
        stagingService.getMyTask().subscribe((res) => {
            setAllTree(res.data.records)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">待打卡节点</div>
            <div className="p-20px">
                {allTree.map((e) => {
                    return (
                        <List key={e.id}>
                            <List.Item
                                className="mb-2"
                                description={
                                    <div>
                                        <div>
                                            <div className="text-16px text-black mb-2">
                                                {e.projectName}
                                            </div>
                                            <div>{e.taskName}</div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between  mt-2 py-11px px-12px bg-[#F8F8F8]">
                                                <div className=" flex text-13px items-center">
                                                    <div className="text-20px text-[#2b64e8] mr-[5px]">
                                                        ·
                                                    </div>
                                                    <div className="text-[#999] whitespace-nowrap">
                                                        截止时间：
                                                    </div>
                                                    <div className="text-[#2b64e8] whitespace-nowrap">
                                                        {dayjs(e.warningTimeFormat).format(
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
                                                    n(`/update-clock-form/${e.taskId}`)
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
                                                    n(`/declare-problem/${e.projectId}`)
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
            </div>
        </div>
    )
}
