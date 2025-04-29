import { TaskDTO, useTaskService } from '@/core/services/task.service'
import { PageList } from '@/shared/components/PageList'
import { Button, Card } from 'antd-mobile'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const ApproveTaskView = () => {
    const taskService = useTaskService()
    const [taskList, setTaskList] = useState<TaskDTO[]>([])
    const n = useNavigate()
    useEffect(() => {
        // taskService.getTaskList({ index: 1, size: 10 }).subscribe((res) => {
        //     setTaskList(res.data.records)
        // })
    }, [])
    return (
        <div className=" bg-[#eff2fa] min-h-100vh">
            <div className="bg-#fff px-20px py-10px text-20px">节点审核</div>
            <PageList
                params={{ status: 'NOTSTART', completeApprovalStatus: 'TOBEREVIEWED' }}
                className="h-100vh"
                request={taskService.getPagedList}
            >
                {(page: any) =>
                    page.map((e: any) => {
                        return (
                            <div
                                key={e.id}
                                className="bg-[#fff] py-15px px-12px  rounded-5px my-20px"
                            >
                                <div className="flex justify-between text-[15px] text-[#333]">
                                    <div>{e.name}</div>
                                </div>
                                <div className="flex justify-between items-center mt-15px">
                                    <div className="text-[#999]">{e.projectName}</div>
                                </div>
                                <div className="flex justify-between  mt-16px py-11px px-12px bg-[#F8F8F8]">
                                    <div className=" flex text-13px items-center">
                                        <div className="text-20px text-[#2b64e8] mr-[5px]">·</div>
                                        <div className="text-[#999]">截止时间：</div>
                                        <div className="text-[#2b64e8]">
                                            {e.endTime
                                                ? dayjs(e.endTime).format('YYYY-MM-DD HH:ss')
                                                : ''}
                                        </div>
                                    </div>
                                    <div className="flex text-13px items-center">
                                        <div className=" text-20px text-[#FFA442] mr-[5px]">·</div>
                                        <div className="text-[#999]">责任人：</div>
                                        <div className="text-[#FFA442]">{e.inChargeMemberName}</div>
                                    </div>
                                </div>
                                <div className="flex mt-2">
                                    <Button
                                        onClick={() => {
                                            n(`/approve-task-detail/${e.id}`)
                                        }}
                                        className="ml-2"
                                        block
                                        color="primary"
                                        size="small"
                                    >
                                        审核
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                }
            </PageList>
        </div>
    )
}
