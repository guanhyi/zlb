import { AllTreeDTO, useTaskService } from '@/core/services/task.service'
import { Button, Collapse, List } from 'antd-mobile'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const AllTree = ({ projectId }: { projectId: string }) => {
    const taskService = useTaskService()

    const [allTree, setAllTree] = useState<AllTreeDTO[]>([])
    const n = useNavigate()
    useEffect(() => {
        taskService.getAllTree(projectId).subscribe((res) => {
            setAllTree(res.data)
        })
    }, [])
    return (
        <div>
            {allTree.map((parent) => {
                return (
                    <List key={parent.id}>
                        <List.Item>{parent.name}</List.Item>
                        {parent.tasks &&
                            parent.tasks.map((e) => {
                                return (
                                    <List key={e.id}>
                                        <List.Item
                                            description={
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        {dayjs(e.startTime).format('YYYY-MM-DD')}
                                                        <span>到</span>
                                                        {dayjs(e.endTime).format('YYYY-MM-DD')}
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            n(`/supervise-project/${projectId}`)
                                                        }}
                                                        color="primary"
                                                        fill="outline"
                                                        size="mini"
                                                    >
                                                        批示督办
                                                    </Button>
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
    )
}
