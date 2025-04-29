import { TaskDynamicsDTO, useTaskDynamicsService } from '@/core/services/task_dynamics.service'
import { Card, Empty, Steps } from 'antd-mobile'
import { Step } from 'antd-mobile/es/components/steps/step'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const TaskLineView = () => {
    const { id } = useParams()
    const [taskDynamics, setTaskDynamics] = useState<TaskDynamicsDTO[]>([])
    const taskDynamicsService = useTaskDynamicsService()
    useEffect(() => {
        taskDynamicsService.getTaskDynamics(id || '').subscribe((res) => {
            setTaskDynamics(res.data)
        })
    }, [])
    return (
        <Card title="节点动态">
            {taskDynamics.length === 0 && <Empty description="暂无数据" />}
            <Steps direction="vertical">
                {taskDynamics.map((e) => {
                    return (
                        <Step
                            title={`${e.creator.username}：${e.dynamics}`}
                            status="finish"
                            description={dayjs(e.createdAt).format('YYYY-MM-DD HH:ss')}
                        />
                    )
                })}
            </Steps>
        </Card>
    )
}
